import type { Application, ApplicationStatus } from "../types/application";

export const terminalStatuses: ApplicationStatus[] = ["approved", "rejected"];
export const editableStatuses: ApplicationStatus[] = ["draft", "need_more_information"];

export type ApplicationActionKey = "edit" | "submit" | "start_review" | "decision";

export type ApplicationAction = {
  key: ApplicationActionKey;
  label: string;
};

export function canEditApplication(application: Pick<Application, "status">) {
  return editableStatuses.includes(application.status);
}

export function canSubmitApplication(application: Pick<Application, "status">) {
  return editableStatuses.includes(application.status);
}

export function canStartReview(application: Pick<Application, "status">) {
  return application.status === "submitted";
}

export function canRecordDecision(application: Pick<Application, "status">) {
  return application.status === "under_review";
}

export function isTerminalApplication(application: Pick<Application, "status">) {
  return terminalStatuses.includes(application.status);
}

export function getApplicationActions(application: Pick<Application, "status">): ApplicationAction[] {
  if (application.status === "draft") {
    return [
      { key: "edit", label: "Edit" },
      { key: "submit", label: "Submit" }
    ];
  }

  if (application.status === "submitted") {
    return [{ key: "start_review", label: "Start Review" }];
  }

  if (application.status === "under_review") {
    return [{ key: "decision", label: "Record Decision" }];
  }

  if (application.status === "need_more_information") {
    return [
      { key: "edit", label: "Edit" },
      { key: "submit", label: "Resubmit" }
    ];
  }

  return [];
}
