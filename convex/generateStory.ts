import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export const generateStory = internalAction({
  args: {
    storyPrompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let attempts = 0;
    let text = "";
    const maxRetries = 2;

    while (attempts < maxRetries) {
      try {
        const response = await generateText({
          model: google("gemini-2.5-flash"),
          prompt: args.storyPrompt!,
          maxOutputTokens: 4000,
        });

        text = response.text?.trim();
        if (text) break; // success
      } catch (error) {
        console.error(
          `Story generation failed (attempt ${attempts + 1}):`,
          error
        );
        if (attempts + 1 === maxRetries)
          throw new Error("Failed to generate story after multiple attempts");
      }
      attempts++;
    }

    console.log(
      "✅ Story successfully generated:",
      text?.slice(0, 200) + "..."
    );
    return text;
  },
});
