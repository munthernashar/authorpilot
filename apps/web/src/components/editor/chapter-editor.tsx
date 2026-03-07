'use client';

import { useState } from 'react';

type Props = {
  initialContent?: string;
};

export function ChapterEditor({ initialContent = '' }: Props) {
  const [content, setContent] = useState(initialContent);

  const applyInlineAi = (mode: 'continue' | 'rewrite' | 'expand') => {
    const marker = `\n\n[AI ${mode.toUpperCase()} REQUESTED at ${new Date().toISOString()}]`;
    setContent((prev) => `${prev}${marker}`);
  };

  return (
    <div className="card">
      <div className="mb-3 flex flex-wrap gap-2">
        <button className="btn-secondary" onClick={() => applyInlineAi('continue')} type="button">
          Continue with AI
        </button>
        <button className="btn-secondary" onClick={() => applyInlineAi('rewrite')} type="button">
          Rewrite selection
        </button>
        <button className="btn-secondary" onClick={() => applyInlineAi('expand')} type="button">
          Expand section
        </button>
      </div>
      <textarea
        className="min-h-[420px] w-full rounded-lg border border-slate-300 p-3 text-sm"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Start writing your chapter here..."
      />
    </div>
  );
}
