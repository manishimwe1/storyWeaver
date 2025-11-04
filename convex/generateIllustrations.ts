"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

/**
 * Helper to pause execution (for retries)
 */
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry wrapper with exponential backoff
 */
async function retryWithDelay(fn: () => Promise<any>, retries = 3, delayMs = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const isRateLimit = err?.status === 429 || err?.message?.includes("429");
      if (isRateLimit && attempt < retries) {
        console.warn(`⚠️ Rate limit hit. Retrying in ${delayMs / 1000}s (Attempt ${attempt}/${retries})...`);
        await delay(delayMs);
        delayMs *= 1.5; // exponential backoff
      } else {
        throw err;
      }
    }
  }
}

/**
 * Generate one image per call using Hugging Face Inference API
 */
export const generatePageIllustration = internalAction({
  args: {
    pageId: v.id("pages"),
    illustrationPrompt: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(`🎨 Generating illustration for page ${args.pageId}...`);

    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    if (!hfApiKey) {
      throw new Error("❌ HUGGINGFACE_API_KEY not configured in environment variables");
    }

    const prompt = args.illustrationPrompt.slice(0, 500); // Limit prompt length

    try {
      const imageUrl = await retryWithDelay(async () => {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${hfApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP ${response.status}: ${text}`);
        }

        // Convert the returned binary image to a Blob
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "image/png" });

        // Store in Convex
        const storageId = await ctx.storage.store(blob);
        const storedImageUrl = await ctx.storage.getUrl(storageId);

        if (!storedImageUrl) {
          throw new Error("❌ Failed to get URL for stored image");
        }

        return { storageId, storedImageUrl };
      });

      // Update database record
      await ctx.runMutation(internal.story.updatePageIllustration, {
        pageId: args.pageId,
        illustrationUrl: imageUrl.storedImageUrl,
        storageId: imageUrl.storageId,
      });

      console.log(`🎉 Image saved successfully for page ${args.pageId}`);

      return {
        pageId: args.pageId,
        illustrationUrl: imageUrl.storedImageUrl,
        storageId: imageUrl.storageId,
      };
    } catch (err) {
      console.error(`❌ Failed to generate page illustration:`, err);
      throw new Error("Failed to generate page illustration using Hugging Face API");
    }
  },
});
