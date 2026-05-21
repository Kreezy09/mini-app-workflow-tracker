import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type { ReviewerDecisionInput, ReviewerDecisionStatus } from "../../types/application";
import { reviewerDecisionOptions } from "../../utils/applicationOptions";
import { cn } from "../../utils/classNames";
import { reviewerDecisionSchema } from "../../utils/validation";
import type { ReviewerDecisionFormValues } from "../../utils/validation";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Notice } from "../ui/Notice";
import { TextAreaInput } from "../ui/TextAreaInput";

export type { ReviewerDecisionFormValues };

type ReviewerDecisionFormProps = {
  isSubmitting?: boolean;
  serverError?: string;
  successMessage?: string;
  onSubmit: (values: ReviewerDecisionInput) => Promise<void> | void;
};

export function ReviewerDecisionForm({
  isSubmitting,
  serverError,
  successMessage,
  onSubmit
}: ReviewerDecisionFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReviewerDecisionFormValues>({
    resolver: zodResolver(reviewerDecisionSchema),
    defaultValues: {
      status: "approved",
      reviewer_comment: ""
    },
    mode: "onBlur"
  });

  const [selectedStatus, setSelectedStatus] = useState<ReviewerDecisionStatus>("approved");
  const statusRegistration = register("status");

  async function submit(values: ReviewerDecisionFormValues) {
    await onSubmit({
      status: values.status,
      reviewer_comment: values.reviewer_comment?.trim() || ""
    });
    reset({ status: "approved", reviewer_comment: "" });
    setSelectedStatus("approved");
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(submit)} noValidate>
      {serverError ? <Notice kind="error" message={serverError} /> : null}
      {successMessage ? <Notice message={successMessage} /> : null}
      <fieldset className="grid gap-3">
        <legend className="text-sm font-black text-slate-800">Decision</legend>
        {reviewerDecisionOptions.map((option) => (
          <label
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-2xl border bg-white px-4 py-3 text-sm font-bold transition",
              selectedStatus === option.value
                ? "border-amber-500 ring-4 ring-amber-200/70"
                : "border-slate-200 hover:border-slate-300"
            )}
            key={option.value}
          >
            <span>{option.label}</span>
            <input
              className="h-4 w-4 accent-amber-600"
              type="radio"
              value={option.value}
              {...statusRegistration}
              onChange={(event) => {
                statusRegistration.onChange(event);
                setSelectedStatus(event.target.value as ReviewerDecisionStatus);
              }}
            />
          </label>
        ))}
      </fieldset>
      <FormField
        label="Reviewer comment"
        error={errors.reviewer_comment?.message}
        helper="Required for Need More Information and Reject decisions."
      >
        <TextAreaInput placeholder="Add a concise reviewer note." {...register("reviewer_comment")} />
      </FormField>
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Recording..." : "Record decision"}
      </Button>
    </form>
  );
}
