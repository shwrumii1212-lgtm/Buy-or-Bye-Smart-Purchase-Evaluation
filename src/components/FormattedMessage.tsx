import React from 'react';

interface FormattedMessageProps {
  content: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content }) => {
  // Process text line by line to handle headers, bullets, dividers, and clean paragraphs
  const lines = content.split('\n');

  const renderInlineStyles = (text: string) => {
    // Replace markdown bold/italic patterns with React elements
    // Split by bold (**text** or ***text***)
    const parts: React.ReactNode[] = [];
    let remaining = text;

    // Clean triple asterisks ***bold italic*** -> bold
    remaining = remaining.replace(/\*\*\*(.*?)\*\*\*/g, '**$1**');

    // Regex to match **bold** or *italic*
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        parts.push(remaining.substring(lastIndex, match.index));
      }

      const matchText = match[0];
      if (matchText.startsWith('**') && matchText.endsWith('**')) {
        parts.push(
          <strong key={match.index} className="font-bold text-[#1E2B37]">
            {matchText.slice(2, -2)}
          </strong>
        );
      } else if (matchText.startsWith('*') && matchText.endsWith('*')) {
        parts.push(
          <em key={match.index} className="italic text-[#334657]">
            {matchText.slice(1, -1)}
          </em>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < remaining.length) {
      parts.push(remaining.substring(lastIndex));
    }

    return parts;
  };

  const renderedBlocks: React.ReactNode[] = [];
  let bulletGroup: string[] = [];

  const flushBullets = () => {
    if (bulletGroup.length > 0) {
      renderedBlocks.push(
        <ul key={`ul-${renderedBlocks.length}`} className="my-2 space-y-1.5 pl-1">
          {bulletGroup.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#384858]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B8BA4] mt-2 shrink-0" />
              <span className="leading-relaxed flex-1">{renderInlineStyles(item)}</span>
            </li>
          ))}
        </ul>
      );
      bulletGroup = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Horizontal rule divider (--- or *** or ___)
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushBullets();
      renderedBlocks.push(
        <hr key={`hr-${index}`} className="my-3 border-t border-[#E5ECF2]" />
      );
      return;
    }

    // Markdown Headers (### Header, ## Header, # Header)
    if (trimmed.startsWith('#')) {
      flushBullets();
      const headerLevel = trimmed.match(/^#+/)?.[0].length || 1;
      const headerText = trimmed.replace(/^#+\s*/, '');
      renderedBlocks.push(
        <h4
          key={`h-${index}`}
          className={`font-heading font-bold text-[#1E2B37] mt-3.5 mb-1 ${
            headerLevel <= 2 ? 'text-sm sm:text-base text-[#24303E]' : 'text-xs sm:text-sm'
          }`}
        >
          {renderInlineStyles(headerText)}
        </h4>
      );
      return;
    }

    // Unordered Bullet points (*, -, •)
    if (/^[\*\-\•]\s+/.test(trimmed)) {
      const itemText = trimmed.replace(/^[\*\-\•]\s+/, '');
      bulletGroup.push(itemText);
      return;
    }

    // Numbered List (1., 2., 3.)
    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberMatch) {
      flushBullets();
      const num = numberMatch[1];
      const itemText = numberMatch[2];
      renderedBlocks.push(
        <div key={`num-${index}`} className="flex items-start gap-2.5 my-1.5 pl-0.5">
          <span className="w-5 h-5 rounded-md bg-[#E2EAF0] text-[#527189] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
            {num}
          </span>
          <div className="text-xs sm:text-sm text-[#384858] leading-relaxed flex-1">
            {renderInlineStyles(itemText)}
          </div>
        </div>
      );
      return;
    }

    // Empty line / paragraph break
    if (!trimmed) {
      flushBullets();
      return;
    }

    // Normal paragraph line
    flushBullets();
    renderedBlocks.push(
      <p key={`p-${index}`} className="my-1.5 text-xs sm:text-sm text-[#384858] leading-relaxed">
        {renderInlineStyles(trimmed)}
      </p>
    );
  });

  flushBullets();

  return <div className="space-y-1">{renderedBlocks}</div>;
};
