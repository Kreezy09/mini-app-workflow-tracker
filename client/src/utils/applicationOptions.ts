import type { ApplicationStatus, ApplicationType, ReviewerDecisionStatus } from "../types/application";

export const applicationTypeOptions: Array<{ value: ApplicationType; label: string }> = [
  { value: "recordation", label: "Recordation" },
  { value: "renewal", label: "Renewal" },
  { value: "change_of_ownership", label: "Change of Ownership" },
  { value: "change_of_name", label: "Change of Name" },
  { value: "discontinuation", label: "Discontinuation" }
];

export const statusOptions: Array<{ value: ApplicationStatus; label: string }> = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "need_more_information", label: "Need More Information" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" }
];

export const reviewerDecisionOptions: Array<{ value: ReviewerDecisionStatus; label: string }> = [
  { value: "approved", label: "Approve" },
  { value: "need_more_information", label: "Need More Information" },
  { value: "rejected", label: "Reject" }
];

export const applicationTypeLabels = Object.fromEntries(
  applicationTypeOptions.map((option) => [option.value, option.label])
) as Record<ApplicationType, string>;

export const statusLabels = Object.fromEntries(
  statusOptions.map((option) => [option.value, option.label])
) as Record<ApplicationStatus, string>;

export const applicationTypeValues = applicationTypeOptions.map((option) => option.value) as [
  ApplicationType,
  ...ApplicationType[]
];

export const reviewerDecisionValues = reviewerDecisionOptions.map((option) => option.value) as [
  ReviewerDecisionStatus,
  ...ReviewerDecisionStatus[]
];
