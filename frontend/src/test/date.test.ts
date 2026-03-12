import { describe, it, expect } from "vitest";
import { format } from "../utils/date";

describe("date utils", () => {
  it("formats date in DD MMMM YYYY", () => {
    expect(format("2024-01-18T00:00:00.000Z")).toContain("January");
    expect(format("2024-01-18T00:00:00.000Z")).toContain("2024");
  });

  it("returns - for empty string", () => {
    expect(format("")).toBe("-");
  });

  it("pads day with leading zero", () => {
    const result = format("2024-03-05T00:00:00.000Z");
    expect(result).toMatch(/^0\d/);
  });
});
