import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  // 👤 Users

  user: defineTable({
    fullname: v.string(),
    username: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("client"))),
    resetToken: v.optional(v.string()),
    resetTokenExpiry: v.optional(v.number()),
  }).index("by_email", ["email"]),

  stories: defineTable({
    title: v.string(),
    storyPrompt: v.string(),
    ageGroup: v.object({
      min: v.number(),
      max: v.number(),
    }),
    coreConcept: v.optional(v.string()),
    status: v.union(
      v.literal("generating"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("generating_illustrations")
    ),
    updatedAt: v.number(),
  })
    .index("by_update_time", ["updatedAt"])
    .index("by_status", ["status"]),

  // Story characters
  characters: defineTable({
    storyId: v.id("stories"),
    name: v.string(),
    description: v.string(),
    role: v.optional(v.string()), // e.g., "protagonist", "sidekick"
    order: v.number(), // For sorting
  }).index("by_story", ["storyId", "order"]),

  // Story pages with text and illustration descriptions
  pages: defineTable({
    storyId: v.id("stories"),
    storageId: v.optional(v.id("_storage")),
    pageNumber: v.number(),
    text: v.string(),
    illustrationPrompt: v.string(),
    illustrationUrl: v.optional(v.string()), // For when you generate images later
    interactiveQuestion: v.optional(v.string()), // Questions like "What colors do you see?"
  }).index("by_story", ["storyId", "pageNumber"]),
});
