import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export const generateStory = internalAction({
  args: {
    storyPrompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: args.storyPrompt || "generate a kid story",
    });
    // await ctx.runMutation(
    //   internal.stories.createStory,
    //   { userId: args.userId, storyPrompt: args.storyPrompt, story: text },
    // );
    return text;
  },
});
