import type { Application } from "../types/application";

export const baseApplication: Application = {
  id: 1,
  tracking_number: "APP-000001",
  applicant_name: "Jane Applicant",
  applicant_email: "jane@example.com",
  company_name: "Example Limited",
  application_type: "recordation",
  description: "Recordation application details",
  status: "draft",
  reviewer_comment: "",
  created_at: "2026-05-20T10:00:00Z",
  updated_at: "2026-05-20T11:00:00Z",
  submitted_at: null,
  reviewed_at: null
};

export function makeApplication(overrides: Partial<Application> = {}): Application {
  return {
    ...baseApplication,
    ...overrides
  };
}
