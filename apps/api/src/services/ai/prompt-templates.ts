export const promptTemplates = {
  titleGenerator: ({ description, language, audience }: { description: string; language: string; audience: string }) => `
You are an expert nonfiction and fiction publishing strategist.
Generate 10 marketable, differentiated book titles.
Return JSON with shape: {"titles": string[] }.
Constraints:
- language: ${language}
- audience: ${audience}
- book concept: ${description}
- avoid clichés and duplicates.
`,

  outlineGenerator: ({
    title,
    description,
    targetChapters,
    language
  }: {
    title: string;
    description: string;
    targetChapters: number;
    language: string;
  }) => `
You are an expert book architect.
Produce a chapter-by-chapter outline in valid JSON with shape:
{
  "chapters": [
    { "title": string, "goal": string, "sections": [{"title": string, "brief": string}] }
  ]
}
Constraints:
- language: ${language}
- title: ${title}
- description: ${description}
- target chapter count: ${targetChapters}
- ensure progression and no repetitive chapter themes.
`,

  chapterContinue: ({
    chapterTitle,
    chapterContent,
    styleGuide,
    maxWords
  }: {
    chapterTitle: string;
    chapterContent: string;
    styleGuide: string;
    maxWords: number;
  }) => `
Continue this chapter with coherent flow and no repetition.
Return plain markdown only.

Title: ${chapterTitle}
Style guide: ${styleGuide}
Max new words: ${maxWords}

Current chapter draft:
${chapterContent}
`,

  chapterRewrite: ({ selection, instruction }: { selection: string; instruction: string }) => `
Rewrite the provided text.
Return markdown only.
Instruction: ${instruction}

Text:
${selection}
`,

  chapterExpand: ({ selection, focus }: { selection: string; focus: string }) => `
Expand this section with richer detail, examples, and specificity.
Return markdown only.
Focus: ${focus}

Section:
${selection}
`
};
