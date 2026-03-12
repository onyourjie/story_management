import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock react-quill-new
vi.mock("react-quill-new", () => ({
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea
      data-testid="quill-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Mock sweetalert2
vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn().mockResolvedValue({ isConfirmed: false }),
  },
}));
