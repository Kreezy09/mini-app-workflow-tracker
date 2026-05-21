export type ApplicationType =
  | "recordation"
  | "renewal"
  | "change_of_ownership"
  | "change_of_name"
  | "discontinuation";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "need_more_information"
  | "approved"
  | "rejected";

export type ReviewerDecisionStatus = "approved" | "need_more_information" | "rejected";

export type Application = {
  id: number;
  tracking_number: string;
  applicant_name: string;
  applicant_email: string;
  company_name: string;
  application_type: ApplicationType;
  description: string;
  status: ApplicationStatus;
  reviewer_comment: string;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  reviewed_at: string | null;
};

export type ApplicationDraftInput = {
  applicant_name: string;
  applicant_email: string;
  company_name: string;
  application_type: ApplicationType;
  description: string;
};

export type ReviewerDecisionInput = {
  status: ReviewerDecisionStatus;
  reviewer_comment?: string;
};

export type ApplicationListFilters = {
  status?: ApplicationStatus | "";
  application_type?: ApplicationType | "";
  search?: string;
};

export type ApiErrorPayload = {
  detail?: string;
};
