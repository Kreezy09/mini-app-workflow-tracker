import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCreateApplicationMutation } from "../api/applicationsApi";
import { ApplicationForm } from "../components/forms/ApplicationForm";
import type { ApplicationFormValues } from "../components/forms/ApplicationForm";
import { PageHeader } from "../components/ui/PageHeader";
import { getApiErrorMessage } from "../utils/apiErrors";

const blankApplication: ApplicationFormValues = {
  applicant_name: "",
  applicant_email: "",
  company_name: "",
  application_type: "recordation",
  description: ""
};

export function ApplicationCreatePage() {
  const navigate = useNavigate();
  const [createApplication, { isLoading }] = useCreateApplicationMutation();
  const [serverError, setServerError] = useState("");

  async function submit(values: ApplicationFormValues) {
    setServerError("");
    try {
      const application = await createApplication(values).unwrap();
      navigate(`/applications/${application.id}`, {
        state: { notice: "Application draft created." }
      });
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="New workflow"
        title="Create application draft"
        description="Start with a draft. The applicant can still update details before submission."
      />
      <ApplicationForm
        defaultValues={blankApplication}
        isSubmitting={isLoading}
        onSubmit={submit}
        serverError={serverError}
        submitLabel="Create draft"
      />
    </div>
  );
}
