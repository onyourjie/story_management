import React, { useState, useRef } from "react";
import Badge from "./Badge";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  disabled?: boolean;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange, label, disabled }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )}
      <div
        className="min-h-12 flex flex-wrap gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-white cursor-text focus-within:ring-2 focus-within:ring-cyan-400"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <Badge
            key={tag}
            label={tag}
            variant="default"
            onRemove={disabled ? undefined : () => onChange(tags.filter((t) => t !== tag))}
          />
        ))}
        {!disabled && (
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addTag(input)}
            placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
            className="outline-none text-sm flex-1 min-w-25 bg-transparent"
          />
        )}
      </div>
    </div>
  );
};

export default TagInput;
