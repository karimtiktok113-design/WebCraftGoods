import React from 'react';

interface FormattedDescriptionProps {
  content?: string;
  className?: string;
}

/**
 * Parses markdown-like text containing:
 * - Bold: **text** or __text__
 * - Italic: *text* or _text_
 */
const renderInlineFormatting = (text: string): React.ReactNode => {
  // Regex to split by bold (**text**), italic (*text*), or inline codes
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={index} className="italic text-slate-200">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
};

type Block =
  | { type: 'paragraph'; lines: string[] }
  | { type: 'bullet-list'; items: string[] }
  | { type: 'numbered-list'; items: string[] };

/**
 * Parses multi-line description text into structured paragraphs and lists,
 * preserving all sentences, distinct paragraphs, and bullet points entered by the user.
 */
export const FormattedDescription: React.FC<FormattedDescriptionProps> = ({
  content,
  className = '',
}) => {
  if (!content || !content.trim()) {
    return null;
  }

  // Normalize Windows/Unix newlines
  const rawLines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  const blocks: Block[] = [];
  let currentParagraphLines: string[] = [];
  let currentBulletItems: string[] = [];
  let currentNumberedItems: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      blocks.push({ type: 'paragraph', lines: [...currentParagraphLines] });
      currentParagraphLines = [];
    }
  };

  const flushBulletList = () => {
    if (currentBulletItems.length > 0) {
      blocks.push({ type: 'bullet-list', items: [...currentBulletItems] });
      currentBulletItems = [];
    }
  };

  const flushNumberedList = () => {
    if (currentNumberedItems.length > 0) {
      blocks.push({ type: 'numbered-list', items: [...currentNumberedItems] });
      currentNumberedItems = [];
    }
  };

  const flushAll = () => {
    flushParagraph();
    flushBulletList();
    flushNumberedList();
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const trimmed = line.trim();

    // Empty line indicates paragraph break
    if (!trimmed) {
      flushAll();
      continue;
    }

    // Bullet point check: lines starting with -, *, +, or unicode bullet symbols (•, ⁃, ◦, ‣)
    const bulletMatch = trimmed.match(/^([-*+•⁃◦‣]|\u2022|\u25E6|\u2043)\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      flushNumberedList();
      currentBulletItems.push(bulletMatch[2]);
      continue;
    }

    // Numbered list check: lines starting with 1., 2., 1), etc.
    const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
    if (numberedMatch) {
      flushParagraph();
      flushBulletList();
      currentNumberedItems.push(numberedMatch[2]);
      continue;
    }

    // Regular line in a paragraph
    flushBulletList();
    flushNumberedList();
    currentParagraphLines.push(line);
  }

  flushAll();

  return (
    <div className={`formatted-description space-y-3.5 ${className}`}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'bullet-list') {
          return (
            <ul key={bIdx} className="space-y-2 my-3 pl-1">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0 shadow-sm shadow-amber-400/50" />
                  <span className="leading-relaxed flex-1">
                    {renderInlineFormatting(item)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'numbered-list') {
          return (
            <ol key={bIdx} className="space-y-2 my-3 pl-1">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <span className="min-w-5 h-5 px-1.5 rounded bg-slate-800 text-amber-400 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 border border-slate-700">
                    {itemIdx + 1}
                  </span>
                  <span className="leading-relaxed flex-1 mt-0.5">
                    {renderInlineFormatting(item)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        // Paragraph block
        return (
          <p key={bIdx} className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            {block.lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInlineFormatting(line)}
                {lIdx < block.lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};
