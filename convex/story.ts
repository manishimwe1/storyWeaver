import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { workflow } from "./workflow";
import { Id } from "./_generated/dataModel";

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

// Create the main story record
export const createStory = internalMutation({
  args: {
    title: v.string(),
    storyPrompt: v.string(),
    ageGroupMin: v.number(),
    ageGroupMax: v.number(),
    coreConcept: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const storyId = await ctx.db.insert("stories", {
      title: args.title,
      storyPrompt: args.storyPrompt,
      ageGroup: {
        min: args.ageGroupMin,
        max: args.ageGroupMax,
      },
      coreConcept: args.coreConcept,
      status: "generating",
      updatedAt: Date.now(),
    });

    return storyId;
  },
});

// Add characters to a story
export const addCharacters = internalMutation({
  args: {
    storyId: v.id("stories"),
    characters: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        role: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const characterIds: Id<"characters">[] = [];

    for (let i = 0; i < args.characters.length; i++) {
      const char = args.characters[i];
      const id = await ctx.db.insert("characters", {
        storyId: args.storyId,
        name: char.name,
        description: char.description,
        role: char.role,
        order: i,
      });
      characterIds.push(id);
    }

    return characterIds;
  },
});

// Add pages to a story
export const addPages = internalMutation({
  args: {
    storyId: v.id("stories"),
    pages: v.array(
      v.object({
        pageNumber: v.number(),
        text: v.string(),
        illustrationPrompt: v.string(),
        interactiveQuestion: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const pageIds: Id<"pages">[] = [];

    for (const page of args.pages) {
      const id = await ctx.db.insert("pages", {
        storyId: args.storyId,
        pageNumber: page.pageNumber,
        text: page.text,
        illustrationPrompt: page.illustrationPrompt,
        interactiveQuestion: page.interactiveQuestion,
      });
      pageIds.push(id);
    }

    return pageIds;
  },
});

// Update story status when complete
export const updateStoryStatus = internalMutation({
  args: {
    storyId: v.id("stories"),
    status: v.union(
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.storyId, {
      status: args.status,
      updatedAt: Date.now(),
    });
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

