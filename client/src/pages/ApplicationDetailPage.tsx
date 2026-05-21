import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import {
  useGetApplicationQuery,
  useRecordDecisionMutation,
  useStartReviewMutation,
  useSubmitApplicationMutation
} from "../api/applicationsApi";
import { ReviewerDecisionForm } from "../components/forms/ReviewerDecisionForm";
import { ActionPanel } from "../components/ui/ActionPanel";
import { Button, ButtonLink } from "../components/ui/Button";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { Notice } from "../components/ui/Notice";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";
import type { ReviewerDecisionInput } from "../types/application";
import { getApiErrorMessage } from "../utils/apiErrors";
import { formatApplicationType, formatDate } from "../utils/format";
import {
  canEditApplication,
  canRecordDecision,
  canStartReview,
  canSubmitApplication,
  getApplicationActions,
  isTerminalApplication
} from "../utils/statusActions";

type DetailLocationState = {
  notice?: string;
};

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-4">
      <dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">{label}</dt>
      <dd className="mt-2 text-sm font-semibold leading-6 text-slate-900">{value}</dd>
    </div>
  );
}

export function ApplicationDetailPage() {
  const { id } = useParams();
  const applicationId = Number(id);
  const location = useLocation();
  const routeNotice = (location.state as DetailLocationState | null)?.notice;
  const { data: application, isLoading, isError, refetch } = useGetApplicationQuery(applicationId, {
    skip: !applicationId
  });
  const [submitApplication, { isLoading: isSubmitting }] = useSubmitApplicationMutation();
  const [startReview, { isLoading: isStartingReview }] = useStartReviewMutation();
  const [recordDecision, { isLoading: isRecordingDecision }] = useRecordDecisionMutation();
  const [actionError, setActionError] = useState("");
  const [actionNotice, setActionNotice] = useState(routeNotice ?? "");

  const actions = useMemo(() => (application ? getApplicationActions(application) : []), [application]);

  async function submitWorkflow() {
    if (!application) {
      return;
    }

    setActionError("");
    try {
      await submitApplication(application.id).unwrap();
      setActionNotice(application.status === "need_more_information" ? "Application resubmitted." : "Application submitted.");
    } catch (error) {
      setActionError(getApiErrorMessage(error));
    }
  }

  async function startWorkflowReview() {
    if (!application) {
      return;
    }

    setActionError("");
    try {
      await startReview(application.id).unwrap();
      setActionNotice("Review started.");
    } catch (error) {
      setActionError(getApiErrorMessage(error));
    }
  }

  async function submitDecision(values: ReviewerDecisionInput) {
    if (!application) {
      return;
    }

    setActionError("");
    try {
      await recordDecision({ id: application.id, body: values }).unwrap();
      setActionNotice("Reviewer decision recorded.");
    } catch (error) {
      setActionError(getApiErrorMessage(error));
      throw error;
    }
  }

  if (isLoading) {
    return <LoadingState label="Loading application details..." />;
  }

  if (isError || !application) {
    return (
      <ErrorState
        message="The application details could not be loaded. Check that the backend server is running."
        onRetry={() => refetch()}
        title="Unable to load application"
      />
    );
  }

  return (
    <div>
      <PageHeader
        actions={<ButtonLink to="/" variant="secondary">Back to dashboard</ButtonLink>}
        eyebrow={application.tracking_number}
        title={application.company_name}
        description="Review the application record, current workflow status, timestamps, and available next actions."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-6">
          {actionNotice ? <Notice message={actionNotice} /> : null}
          {actionError ? <Notice kind="error" message={actionError} /> : null}

          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-panel backdrop-blur md:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">Current status</p>
                <div className="mt-2">
                  <StatusBadge status={application.status} />
                </div>
              </div>
              <div className="text-sm font-semibold text-slate-500">
                Updated {formatDate(application.updated_at)}
              </div>
            </div>

            <dl className="grid gap-4 md:grid-cols-2">
              <DetailItem label="Applicant" value={application.applicant_name} />
              <DetailItem label="Applicant email" value={application.applicant_email} />
              <DetailItem label="Company" value={application.company_name} />
              <DetailItem label="Application type" value={formatApplicationType(application.application_type)} />
              <DetailItem label="Created" value={formatDate(application.created_at)} />
              <DetailItem label="Submitted" value={formatDate(application.submitted_at)} />
              <DetailItem label="Reviewed" value={formatDate(application.reviewed_at)} />
              <DetailItem label="Tracking number" value={application.tracking_number} />
            </dl>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-panel backdrop-blur md:p-8">
            <h2 className="text-xl font-black tracking-tight text-slate-950">Application description</h2>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{application.description}</p>
          </div>

          {application.reviewer_comment ? (
            <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 shadow-panel md:p-8">
              <h2 className="text-xl font-black tracking-tight text-amber-950">Reviewer comment</h2>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-amber-950">{application.reviewer_comment}</p>
            </div>
          ) : null}
        </section>

        <ActionPanel
          description={
            actions.length > 0
              ? "Only workflow-valid actions are shown for the current status."
              : "This workflow is complete and has no available edit actions."
          }
          title="Workflow actions"
        >
          {canEditApplication(application) ? (
            <ButtonLink to={`/applications/${application.id}/edit`} variant="secondary">
              Edit application
            </ButtonLink>
          ) : null}
          {canSubmitApplication(application) ? (
            <Button disabled={isSubmitting} onClick={submitWorkflow}>
              {isSubmitting ? "Submitting..." : application.status === "need_more_information" ? "Resubmit" : "Submit"}
            </Button>
          ) : null}
          {canStartReview(application) ? (
            <Button disabled={isStartingReview} onClick={startWorkflowReview}>
              {isStartingReview ? "Starting..." : "Start Review"}
            </Button>
          ) : null}
          {canRecordDecision(application) ? (
            <ReviewerDecisionForm
              isSubmitting={isRecordingDecision}
              onSubmit={submitDecision}
              serverError={actionError}
              successMessage=""
            />
          ) : null}
          {isTerminalApplication(application) ? (
            <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
              Approved and rejected applications are read-only.
            </p>
          ) : null}
        </ActionPanel>
      </div>
    </div>
  );
}
