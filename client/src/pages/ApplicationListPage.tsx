import { useState } from "react";
import { Link } from "react-router-dom";

import { useListApplicationsQuery } from "../api/applicationsApi";
import { Button, ButtonLink } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { LoadingState } from "../components/ui/LoadingState";
import { PageHeader } from "../components/ui/PageHeader";
import { SelectInput } from "../components/ui/SelectInput";
import { StatusBadge } from "../components/ui/StatusBadge";
import { TextInput } from "../components/ui/TextInput";
import type { ApplicationListFilters, ApplicationStatus, ApplicationType } from "../types/application";
import { applicationTypeOptions, statusOptions } from "../utils/applicationOptions";
import { formatApplicationType, formatDate } from "../utils/format";

export function ApplicationListPage() {
  const [filters, setFilters] = useState<ApplicationListFilters>({});
  const { data: applications = [], isLoading, isFetching, isError, refetch } = useListApplicationsQuery(filters);

  function updateFilter<Key extends keyof ApplicationListFilters>(key: Key, value: ApplicationListFilters[Key]) {
    setFilters((current) => ({
      ...current,
      [key]: value
    }));
  }

  return (
    <div>
      <PageHeader
        eyebrow="Workflow dashboard"
        title="Application queue"
        description="Track drafts, submissions, reviews, and decisions from one operational dashboard."
        actions={<ButtonLink to="/applications/new">Create draft</ButtonLink>}
      />

      <section className="mb-6 rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-panel backdrop-blur md:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_220px_240px_auto] md:items-center">
          <TextInput
            aria-label="Search applicants"
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Search applicant names"
            value={filters.search ?? ""}
          />
          <SelectInput
            aria-label="Filter by status"
            onChange={(event) => updateFilter("status", event.target.value as ApplicationStatus | "")}
            value={filters.status ?? ""}
          >
            <option value="">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </SelectInput>
          <SelectInput
            aria-label="Filter by application type"
            onChange={(event) => updateFilter("application_type", event.target.value as ApplicationType | "")}
            value={filters.application_type ?? ""}
          >
            <option value="">All application types</option>
            {applicationTypeOptions.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </SelectInput>
          <Button disabled={isFetching} onClick={() => refetch()} variant="secondary">
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </section>

      {isLoading ? <LoadingState /> : null}

      {isError ? (
        <ErrorState
          message="The application list could not be loaded. Check that the backend server is running."
          onRetry={() => refetch()}
        />
      ) : null}

      {!isLoading && !isError && applications.length === 0 ? (
        <EmptyState
          action={<ButtonLink to="/applications/new">Create the first draft</ButtonLink>}
          message="No applications match the current filters. Create a draft or adjust the filters."
          title="No applications found"
        />
      ) : null}

      {!isLoading && !isError && applications.length > 0 ? (
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-panel backdrop-blur">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="border-b border-slate-200 bg-slate-950 text-xs uppercase tracking-[0.16em] text-white">
                <tr>
                  <th className="px-5 py-4">Tracking</th>
                  <th className="px-5 py-4">Applicant</th>
                  <th className="px-5 py-4">Company</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((application) => (
                  <tr className="transition hover:bg-amber-50/70" key={application.id}>
                    <td className="px-5 py-4 font-black text-slate-950">
                      <Link className="hover:text-amber-700" to={`/applications/${application.id}`}>
                        {application.tracking_number}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">{application.applicant_name}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{application.company_name}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatApplicationType(application.application_type)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">{formatDate(application.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 p-4 md:hidden">
            {applications.map((application) => (
              <Link
                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-300"
                key={application.id}
                to={`/applications/${application.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-950">{application.tracking_number}</p>
                    <p className="mt-1 text-sm text-slate-600">{application.applicant_name}</p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>
                <dl className="mt-4 grid gap-2 text-sm text-slate-600">
                  <div className="flex justify-between gap-3">
                    <dt className="font-semibold text-slate-500">Company</dt>
                    <dd className="text-right">{application.company_name}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="font-semibold text-slate-500">Type</dt>
                    <dd className="text-right">{formatApplicationType(application.application_type)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="font-semibold text-slate-500">Created</dt>
                    <dd className="text-right">{formatDate(application.created_at)}</dd>
                  </div>
                </dl>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
