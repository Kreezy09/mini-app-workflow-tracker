import { applicationTypeLabels, statusLabels } from "./applicationOptions";
import type { ApplicationStatus, ApplicationType } from "../types/application";

export function formatApplicationType(type: ApplicationType) {
  return applicationTypeLabels[type];
}

export function formatStatus(status: ApplicationStatus) {
  return statusLabels[status];
}

export function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
