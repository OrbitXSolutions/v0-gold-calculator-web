"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: (p) => <h1 className="mt-8 mb-4 text-3xl font-semibold" {...p} />,
          h2: (p) => <h2 className="mt-8 mb-3 text-2xl font-semibold" {...p} />,
          h3: (p) => <h3 className="mt-6 mb-2 text-xl font-semibold" {...p} />,
          p: (p) => <p className="mb-4 leading-relaxed text-gray-800" {...p} />,
          ul: (p) => <ul className="list-disc pl-6 mb-4 space-y-1" {...p} />,
          ol: (p) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...p} />,
          li: (p) => <li className="leading-relaxed" {...p} />,
          a: (p) => <a className="text-yellow-600 hover:underline" {...p} />,
          code: (p) => <code className="px-1 py-0.5 rounded bg-gray-100 text-sm" {...p} />,
          pre: (p) => <pre className="mb-4 p-4 rounded bg-gray-900 text-gray-100 overflow-auto text-sm" {...p} />,
          blockquote: (p) => <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-gray-700 my-4" {...p} />,
          table: (p) => <table className="w-full text-sm mb-4 border" {...p} />,
          thead: (p) => <thead className="bg-gray-100" {...p} />,
          th: (p) => <th className="border px-2 py-1 text-left" {...p} />,
          td: (p) => <td className="border px-2 py-1" {...p} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
