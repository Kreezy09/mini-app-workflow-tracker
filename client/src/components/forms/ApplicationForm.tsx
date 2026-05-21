import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { applicationTypeOptions } from "../../utils/applicationOptions";
import { applicationFormSchema } from "../../utils/validation";
import type { ApplicationFormValues } from "../../utils/validation";
import { Button, ButtonLink } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { FormSection } from "../ui/FormSection";
import { Notice } from "../ui/Notice";
import { SelectInput } from "../ui/SelectInput";
import { TextAreaInput } from "../ui/TextAreaInput";
import { TextInput } from "../ui/TextInput";

export type { ApplicationFormValues };

type ApplicationFormProps = {
  defaultValues: ApplicationFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  serverError?: string;
  onSubmit: (values: ApplicationFormValues) => Promise<void> | void;
};

export function ApplicationForm({ defaultValues, submitLabel, isSubmitting, serverError, onSubmit }: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues,
    mode: "onBlur"
  });

  return (
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError ? <Notice kind="error" message={serverError} /> : null}
      <FormSection
        title="Applicant details"
        description="Capture the applicant and company information needed to identify this workflow."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Applicant name" error={errors.applicant_name?.message}>
            <TextInput
              aria-label="Applicant name"
              autoComplete="name"
              placeholder="Jane Applicant"
              {...register("applicant_name")}
            />
          </FormField>
          <FormField label="Applicant email" error={errors.applicant_email?.message}>
            <TextInput
              aria-label="Applicant email"
              autoComplete="email"
              placeholder="jane@example.com"
              type="email"
              {...register("applicant_email")}
            />
          </FormField>
        </div>
        <FormField label="Company name" error={errors.company_name?.message}>
          <TextInput
            aria-label="Company name"
            autoComplete="organization"
            placeholder="Example Limited"
            {...register("company_name")}
          />
        </FormField>
      </FormSection>
      <FormSection
        title="Application details"
        description="Choose the application type and provide enough context for review."
      >
        <FormField label="Application type" error={errors.application_type?.message}>
          <SelectInput aria-label="Application type" {...register("application_type")}>
            <option value="">Select an application type</option>
            {applicationTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectInput>
        </FormField>
        <FormField label="Description" error={errors.description?.message}>
          <TextAreaInput
            aria-label="Description"
            placeholder="Briefly describe the application request."
            {...register("description")}
          />
        </FormField>
      </FormSection>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <ButtonLink className="w-full sm:w-auto" to="/" variant="secondary">
          Cancel
        </ButtonLink>
        <Button className="w-full sm:w-auto" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
