import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { workflow } from "./workflow";

export const kickoffWorkflow = mutation({
    args: {
        storyPrompt: v.optional(v.string()),
    },
  handler: async (ctx, args) => {

    const workflowId = await workflow.start(
      ctx,
      internal.workflow.generateStoryWorkflow,
      { storyPrompt: args.storyPrompt || "" }
    );
  },
});


export const createStory = internalMutation({
  args: {
    storyPrompt: v.string(),
    title: v.string(),
    content: v.string(),
    storyAge: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const storyId = await ctx.db.insert("stories", {
      storyPrompt: args.storyPrompt,
      title: args.title,
      content: args.content,
      storyAge: args.storyAge,
      
    });
    return storyId;
  },
});

export const getStories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("stories").collect();
  },
});
export const getStoryById = query({
  args: { id: v.id("stories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

