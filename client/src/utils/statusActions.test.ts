import { describe, expect, it } from "vitest";

import { makeApplication } from "../test/mockData";
import {
  canEditApplication,
  canRecordDecision,
  canStartReview,
  canSubmitApplication,
  getApplicationActions,
  isTerminalApplication
} from "./statusActions";

describe("statusActions", () => {
  it("returns valid actions for each workflow status", () => {
    expect(getApplicationActions(makeApplication({ status: "draft" })).map((action) => action.key)).toEqual([
      "edit",
      "submit"
    ]);
    expect(getApplicationActions(makeApplication({ status: "submitted" })).map((action) => action.key)).toEqual([
      "start_review"
    ]);
    expect(getApplicationActions(makeApplication({ status: "under_review" })).map((action) => action.key)).toEqual([
      "decision"
    ]);
    expect(getApplicationActions(makeApplication({ status: "need_more_information" })).map((action) => action.key)).toEqual([
      "edit",
      "submit"
    ]);
    expect(getApplicationActions(makeApplication({ status: "approved" }))).toEqual([]);
  });

  it("centralizes workflow action guards", () => {
    expect(canEditApplication(makeApplication({ status: "draft" }))).toBe(true);
    expect(canSubmitApplication(makeApplication({ status: "need_more_information" }))).toBe(true);
    expect(canStartReview(makeApplication({ status: "submitted" }))).toBe(true);
    expect(canRecordDecision(makeApplication({ status: "under_review" }))).toBe(true);
    expect(isTerminalApplication(makeApplication({ status: "rejected" }))).toBe(true);
  });
});
