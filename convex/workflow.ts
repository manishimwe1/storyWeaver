import { WorkflowManager } from "@convex-dev/workflow";
import { components, internal } from "./_generated/api";
import { v } from "convex/values";

export const workflow = new WorkflowManager(components.workflow);

export const generateStoryWorkflow = workflow.define({
  args: {
    storyPrompt: v.string(),
  },
  handler: async (step, args): Promise<void> => {
    const storyText = await step.runAction(
      internal.generateStory.generateStory,
      { storyPrompt: args.storyPrompt },
    );

    const lines = storyText.split('\n');
    const title = lines[2].replace('***', '').trim(); // Assuming title is on the third line after the *** separator
    const content = lines.slice(4).join('\n').trim(); // Assuming content starts from the fifth line

    const storyId = await step.runMutation(internal.story.createStory, {
      storyPrompt: args.storyPrompt,
      title: title,
      content: content,
      storyAge: [5],

    });

    console.log({ storyText,storyId });
  },
});
