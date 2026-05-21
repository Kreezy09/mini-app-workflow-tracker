import { z } from "zod";

import { applicationTypeValues, reviewerDecisionValues } from "./applicationOptions";

export const applicationFormSchema = z.object({
  applicant_name: z.string().min(1, "Applicant name is required."),
  applicant_email: z.string().email("Enter a valid email address."),
  company_name: z.string().min(1, "Company name is required."),
  application_type: z.enum(applicationTypeValues, "Select an application type."),
  description: z.string().min(1, "Description is required.")
});

export const reviewerDecisionSchema = z
  .object({
    status: z.enum(reviewerDecisionValues),
    reviewer_comment: z.string().optional()
  })
  .superRefine((value, context) => {
    const requiresComment = value.status === "need_more_information" || value.status === "rejected";
    if (requiresComment && !value.reviewer_comment?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["reviewer_comment"],
        message: "Reviewer comment is required for this decision."
      });
    }
  });

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
export type ReviewerDecisionFormValues = z.infer<typeof reviewerDecisionSchema>;
