import { WorkflowManager } from "@convex-dev/workflow";
import { components, internal } from "./_generated/api";
import { v } from "convex/values";
import { parseStoryText } from "../lib/generatedTextParse";

export const workflow = new WorkflowManager(components.workflow);

export const generateStoryWorkflow = workflow.define({
  args: {
    storyPrompt: v.string(),
  },

  handler: async (step, args): Promise<void> => {
    try {
      // 1️⃣ Generate story text from the AI
      console.log("📝 Generating story from AI...");
      const storyText = await step.runAction(internal.generateStory.generateStory, {
        storyPrompt: args.storyPrompt,
      });

      if (!storyText || storyText.trim().length === 0) {
        throw new Error("Generated story text is empty.");
      }

      // 2️⃣ Parse the story text into structured data
      console.log("🔍 Parsing story structure...");
      const parsedStory = parseStoryText(storyText);

      console.log("✅ Parsed story:", {
        title: parsedStory.title,
        characterCount: parsedStory.characters.length,
        pageCount: parsedStory.pages.length,
      });

      // 3️⃣ Create the main story record
      console.log("💾 Saving story to database...");
      const storyId = await step.runMutation(internal.story.createStory, {
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
        await step.runMutation(internal.story.addPages, {
          storyId,
          pages: parsedStory.pages,
        });
      }

      // 6️⃣ Mark story as completed
      await step.runMutation(internal.story.updateStoryStatus, {
        storyId,
        status: "completed",
      });

      console.log("✅ Story generated and saved successfully:", {
        storyId,
        title: parsedStory.title,
        ageGroup: `${parsedStory.ageGroup.min}-${parsedStory.ageGroup.max}`,
        characters: parsedStory.characters.length,
        pages: parsedStory.pages.length,
      });

      return;
    } catch (error) {
      console.error("❌ Error in generateStoryWorkflow:", error);

      // If we created a story record, mark it as failed
      // (You'd need to track the storyId across steps to do this)
      
      throw new Error(
        `Story generation failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
});