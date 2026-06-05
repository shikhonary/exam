import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import React from "react";

const BLOCK_TRIGGERS = ["\\lim", "\\int", "\\sum", "\\prod"];

function shouldRenderBlock(math: string) {
  return BLOCK_TRIGGERS.some((cmd) => math.includes(cmd));
}

export function parseMathString(input: string): React.ReactNode {
  if (!input) return input;
  
  // Normalize literal JSX tags (<InlineMath math="..." />) into standard LaTeX delimiters \( ... \)
  // so that the regex below can parse them properly.
  const normalizedInput = input
    .replace(/<InlineMath\s+math=["'](.*?)["']\s*\/>/g, "\\($1\\)")
    .replace(/<BlockMath\s+math=["'](.*?)["']\s*\/>/g, "\\($1\\)");

  const parts = normalizedInput.split(/\\\((.*?)\\\)/s);

  if (parts.length === 1) return input; // no math found

  return parts.map((part, index) => {
    // Normal text
    if (index % 2 === 0) return part;

    const math = part.trim();

    // Block math (limits below)
    if (shouldRenderBlock(math)) {
      return <BlockMath key={index} math={math} />;
    }

    // Inline math
    return <InlineMath key={index} math={math} />;
  });
}
