import { WorkflowManager } from "@convex-dev/workflow";
import { components, internal } from "./_generated/api";
import { v } from "convex/values";
import { parseStoryText } from "../lib/generatedTextParse";

export const workflow = new WorkflowManager(components.workflow, {
  workpoolOptions: {
    retryActionsByDefault: true,
    defaultRetryBehavior: {
      maxAttempts: 3,
      initialBackoffMs: 1000,
      base: 2000,
    },
  },
});

export const generateStoryWorkflow = workflow.define({
  args: {
    storyPrompt: v.string(),
    generateIllustrations: v.optional(v.boolean()), // Option to skip illustrations
  },

  handler: async (step, args): Promise<void> => {
    let storyId: any = null;

    try {
      // 1️⃣ Generate story text from the AI
      console.log("📝 Generating story from AI...");
      const storyText = await step.runAction(
        internal.generateStory.generateStory,
        {
          storyPrompt: args.storyPrompt,
        }
      );

      if (!storyText || storyText.trim().length === 0) {
        throw new Error("Generated story text is empty.");
      }

      // 2️⃣ Parse the story text into structured data
      console.log("🔍 Parsing story structure...");
      const parsedStory = parseStoryText(storyText);

      if (parsedStory.title === "Error Story") {
        throw new Error("Failed to parse generated story text.");
      }

      console.log("✅ Parsed story:", {
        title: parsedStory.title,
        characterCount: parsedStory.characters.length,
        pageCount: parsedStory.pages.length,
      });

      // 3️⃣ Create the main story record
      console.log("💾 Saving story to database...");
      storyId = await step.runMutation(internal.story.createStory, {
        title: parsedStory.title,
        storyPrompt: args.storyPrompt,
        ageGroupMin: parsedStory.ageGroup.min,
        ageGroupMax: parsedStory.ageGroup.max,
        coreConcept: parsedStory.coreConcept,
      });

      // 4️⃣ Add characters to the story
      if (parsedStory.characters.length > 0) {
        console.log(`👥 Adding ${parsedStory.characters.length} characters...`);
        await step.runMutation(internal.story.addCharacters, {
          storyId,
          characters: parsedStory.characters,
        });
      }

      // 5️⃣ Add pages to the story
      if (parsedStory.pages.length > 0) {
        console.log(`📖 Adding ${parsedStory.pages.length} pages...`);
        const pageIds = await step.runMutation(internal.story.addPages, {
          storyId,
          pages: parsedStory.pages,
        });

        // 6️⃣ Generate illustrations for each page (if enabled)
        if (args.generateIllustrations !== false) {
          console.log("🎨 Starting illustration generation...");

          // Update story status to show we're generating illustrations
          await step.runMutation(internal.story.updateStoryStatus, {
            storyId,
            status: "generating_illustrations",
          });

          // Generate illustrations for each page in parallel
          // Note: You might want to rate limit this if you have many pages
          const illustrationPromises = parsedStory.pages.map((page, index) => {
            return step.runAction(
              internal.generateIllustrations.generatePageIllustration,
              {
                pageId: pageIds[index],
                illustrationPrompt: page.illustrationPrompt,
              }
            );
          });

          // Wait for all illustrations to be generated
          // Using Promise.allSettled to continue even if some fail
          const results = await Promise.allSettled(illustrationPromises);

          const successCount = results.filter(
            (r) => r.status === "fulfilled"
          ).length;
          const failCount = results.filter(
            (r) => r.status === "rejected"
          ).length;

          console.log(
            `✅ Generated ${successCount} illustrations successfully`
          );
          if (failCount > 0) {
            console.warn(`⚠️  ${failCount} illustrations failed to generate`);
          }
        }
      }

      // 7️⃣ Mark story as completed
      await step.runMutation(internal.story.updateStoryStatus, {
        storyId,
        status: "completed",
      });

      console.log("✅ Story generation workflow completed:", {
        storyId,
        title: parsedStory.title,
        ageGroup: `${parsedStory.ageGroup.min}-${parsedStory.ageGroup.max}`,
        characters: parsedStory.characters.length,
        pages: parsedStory.pages.length,
        illustrationsGenerated: args.generateIllustrations !== false,
      });

      return;
    } catch (error) {
      console.error("❌ Error in generateStoryWorkflow:", error);

      // Mark story as failed if we created it
      if (storyId) {
        try {
          await step.runMutation(internal.story.updateStoryStatus, {
            storyId,
            status: "failed",
          });
        } catch (updateError) {
          console.error("Failed to update story status:", updateError);
        }
      }

      throw new Error(
        `Story generation failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  },
});

// Optional: Separate workflow just for generating illustrations for existing story
export const generateIllustrationsWorkflow = workflow.define({
  args: {
    storyId: v.id("stories"),
  },

  handler: async (step, args): Promise<void> => {
    try {
      console.log(
        `🎨 Starting illustration generation for story ${args.storyId}...`
      );

      // Get all pages for this story
      const pages = await step.runQuery(
        internal.storyQueries.getPagesByStoryId,
        {
          storyId: args.storyId,
        }
      );

      if (pages.length === 0) {
        throw new Error("No pages found for this story");
      }

      // Update story status
      await step.runMutation(internal.story.updateStoryStatus, {
        storyId: args.storyId,
        status: "generating_illustrations",
      });

      // Generate illustrations for each page
      const results = await Promise.allSettled(
        pages.map((page) =>
          step.runAction(
            internal.generateIllustrations.generatePageIllustration,
            {
              pageId: page._id,
              illustrationPrompt: page.illustrationPrompt,
            }
          )
        )
      );

      const successCount = results.filter(
        (r) => r.status === "fulfilled"
      ).length;
      const failCount = results.filter((r) => r.status === "rejected").length;

      console.log(`✅ Generated ${successCount}/${pages.length} illustrations`);

      // Update story status back to completed
      await step.runMutation(internal.story.updateStoryStatus, {
        storyId: args.storyId,
        status: "completed",
      });

      if (failCount > 0) {
        console.warn(`⚠️  ${failCount} illustrations failed`);
      }

      return;
    } catch (error) {
      console.error("❌ Error in generateIllustrationsWorkflow:", error);

      await step.runMutation(internal.story.updateStoryStatus, {
        storyId: args.storyId,
        status: "completed", // Keep as completed even if illustrations fail
      });

      throw error;
    }
  },
});
