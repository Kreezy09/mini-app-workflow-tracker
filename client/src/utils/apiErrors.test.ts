import { describe, expect, it } from "vitest";

import { getApiErrorMessage } from "./apiErrors";

describe("getApiErrorMessage", () => {
  it("returns a default message for unknown errors", () => {
    expect(getApiErrorMessage(null)).toBe("Something went wrong. Please try again.");
  });

  it("returns string API errors", () => {
    expect(getApiErrorMessage({ data: "Plain failure" })).toBe("Plain failure");
  });

  it("returns detail API errors", () => {
    expect(getApiErrorMessage({ data: { detail: "Detailed failure" } })).toBe("Detailed failure");
  });

  it("returns serialized error messages", () => {
    expect(getApiErrorMessage({ message: "Serialized failure" })).toBe("Serialized failure");
  });

  it("falls back when no supported message exists", () => {
    expect(getApiErrorMessage({ data: {} })).toBe("Something went wrong. Please try again.");
  });
});
