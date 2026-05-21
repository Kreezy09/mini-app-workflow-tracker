import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetApplicationQuery, useUpdateApplicationMutation } from "../api/applicationsApi";
import { ApplicationForm } from "../components/forms/ApplicationForm";
import type { ApplicationFormValues } from "../components/forms/ApplicationForm";
import { ButtonLink } from "../components/ui/Button";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { canEditApplication } from "../utils/statusActions";
import { getApiErrorMessage } from "../utils/apiErrors";

export function ApplicationEditPage() {
  const { id } = useParams();
  const applicationId = Number(id);
  const navigate = useNavigate();
  const { data: application, isLoading, isError, refetch } = useGetApplicationQuery(applicationId, {
    skip: !applicationId
  });
  const [updateApplication, { isLoading: isUpdating }] = useUpdateApplicationMutation();
  const [serverError, setServerError] = useState("");

  async function submit(values: ApplicationFormValues) {
    if (!application) {
      return;
    }

    setServerError("");
    try {
      const updated = await updateApplication({ id: application.id, body: values }).unwrap();
      navigate(`/applications/${updated.id}`, {
        state: { notice: "Application updated." }
      });
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    }
  }

  if (isLoading) {
    return <LoadingState label="Loading application..." />;
  }

  if (isError || !application) {
    return (
      <ErrorState
        message="This application could not be loaded for editing."
        onRetry={() => refetch()}
        title="Unable to load application"
      />
    );
  }

  if (!canEditApplication(application)) {
    return (
      <ErrorState
        message="This application status does not allow edits."
        title="Application cannot be edited"
      />
    );
  }

  const defaultValues: ApplicationFormValues = {
    applicant_name: application.applicant_name,
    applicant_email: application.applicant_email,
    company_name: application.company_name,
    application_type: application.application_type,
    description: application.description
  };

  return (
    <div>
      <PageHeader
        actions={<ButtonLink to={`/applications/${application.id}`} variant="secondary">Back to detail</ButtonLink>}
        eyebrow={application.tracking_number}
        title="Edit application"
        description="Update editable application details before resubmitting or submitting the workflow."
      />
      <ApplicationForm
        defaultValues={defaultValues}
        isSubmitting={isUpdating}
        onSubmit={submit}
        serverError={serverError}
        submitLabel="Save changes"
      />
    </div>
  );
}
