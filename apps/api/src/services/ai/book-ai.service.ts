import { aiTextService } from './openai.service.js';
import { promptTemplates } from './prompt-templates.js';

export const bookAiService = {
  async generateTitles(input: { description: string; language: string; audience: string }) {
    const result = await aiTextService.generateJson<{ titles: string[] }>({
      prompt: promptTemplates.titleGenerator(input),
      temperature: 0.6
    });

    return result.titles ?? [];
  },

  async generateOutline(input: {
    title: string;
    description: string;
    targetChapters: number;
    language: string;
  }) {
    return aiTextService.generateJson<{
      chapters: Array<{ title: string; goal: string; sections: Array<{ title: string; brief: string }> }>;
    }>({
      prompt: promptTemplates.outlineGenerator(input),
      temperature: 0.4
    });
  },

  async continueChapter(input: {
    chapterTitle: string;
    chapterContent: string;
    styleGuide: string;
    maxWords: number;
  }) {
    return aiTextService.generateText({
      prompt: promptTemplates.chapterContinue(input),
      temperature: 0.7,
      maxTokens: 1400
    });
  },

  async rewriteSelection(input: { selection: string; instruction: string }) {
    return aiTextService.generateText({
      prompt: promptTemplates.chapterRewrite(input),
      temperature: 0.6,
      maxTokens: 900
    });
  },

  async expandSelection(input: { selection: string; focus: string }) {
    return aiTextService.generateText({
      prompt: promptTemplates.chapterExpand(input),
      temperature: 0.7,
      maxTokens: 1100
    });
  }
};
