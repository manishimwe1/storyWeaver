// storyQueries.ts - Query functions to retrieve stories

import { internalQuery, query } from "./_generated/server";
import { v } from "convex/values";

// Get a complete story with all its components
export const getStory = query({
  args: { storyId: v.id("stories") },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.storyId);
    if (!story) return null;

    // Get all characters for this story
    const characters = await ctx.db
      .query("characters")
      .withIndex("by_story", (q) => q.eq("storyId", args.storyId))
      .collect();

    // Sort characters by order
    characters.sort((a, b) => a.order - b.order);

    // Get all pages for this story
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_story", (q) => q.eq("storyId", args.storyId))
      .collect();

    // Sort pages by page number
    pages.sort((a, b) => a.pageNumber - b.pageNumber);

    return {
      ...story,
      characters,
      pages,
    };
  },
});

// List all stories (for a library view)
export const listStories = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    const stories = await ctx.db
      .query("stories")
      .withIndex("by_creation_time")
      .order("desc")
      .take(limit);

    // For each story, get the character count and page count
    const storiesWithCounts = await Promise.all(
      stories.map(async (story) => {
        const characterCount = (
          await ctx.db
            .query("characters")
            .withIndex("by_story", (q) => q.eq("storyId", story._id))
            .collect()
        ).length;

        const pageCount = (
          await ctx.db
            .query("pages")
            .withIndex("by_story", (q) => q.eq("storyId", story._id))
            .collect()
        ).length;

        return {
          ...story,
          characterCount,
          pageCount,
        };
      })
    );

    return storiesWithCounts;
  },
});

// Get a specific page from a story
export const getPage = query({
  args: {
    storyId: v.id("stories"),
    pageNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("pages")
      .withIndex("by_story", (q) => q.eq("storyId", args.storyId))
      .filter((q) => q.eq(q.field("pageNumber"), args.pageNumber))
      .first();

    return page;
  },
});
// Get all pages for a story by storyId
export const getPagesByStoryId = internalQuery({
  args: {
    storyId: v.id("stories"),
  },
  handler: async (ctx, args) => {
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_story", (q) => q.eq("storyId", args.storyId))
      .collect();

    // Sort pages by page number
    pages.sort((a, b) => a.pageNumber - b.pageNumber);

    return pages;
  },
});
