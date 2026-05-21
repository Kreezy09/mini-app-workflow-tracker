import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

import type { ApiErrorPayload } from "../types/application";

export function getApiErrorMessage(error: FetchBaseQueryError | SerializedError | unknown) {
  if (!error || typeof error !== "object") {
    return "Something went wrong. Please try again.";
  }

  if ("data" in error) {
    const data = error.data as ApiErrorPayload | string | undefined;
    if (typeof data === "string" && data) {
      return data;
    }
    if (typeof data === "object" && data?.detail) {
      return data.detail;
    }
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
