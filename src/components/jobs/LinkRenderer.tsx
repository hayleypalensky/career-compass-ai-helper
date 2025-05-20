
import React from "react";

interface LinkRendererProps {
  text: string;
}

const LinkRenderer = ({ text }: LinkRendererProps) => {
  if (!text) return <span>No notes added yet.</span>;
  
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split by URLs and map parts to either text or anchor elements
  const parts = text.split(urlRegex);
  const matches = text.match(urlRegex) || [];
  
  return (
    <>
      {parts.map((part, index) => {
        // Every even index is text, odd indices are URLs
        if (index % 2 === 0) {
          return <span key={index}>{part}</span>;
        } else {
          const url = matches[(index - 1) / 2];
          return (
            <a 
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {url}
            </a>
          );
        }
      })}
    </>
  );
};

export default LinkRenderer;
