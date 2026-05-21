import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  Application,
  ApplicationDraftInput,
  ApplicationListFilters,
  ReviewerDecisionInput
} from "../types/application";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

function resolveApiBaseUrl(value: string) {
  const trimmed = value.replace(/\/$/, "");
  if (/^https?:\/\//.test(trimmed)) {
    return trimmed;
  }

  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${window.location.origin}${path}`;
}

export const apiBaseUrl = resolveApiBaseUrl(rawApiBaseUrl);

function buildListParams(filters?: ApplicationListFilters) {
  return {
    ...(filters?.status ? { status: filters.status } : {}),
    ...(filters?.application_type ? { application_type: filters.application_type } : {}),
    ...(filters?.search ? { search: filters.search } : {})
  };
}

export const applicationsApi = createApi({
  reducerPath: "applicationsApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  tagTypes: ["Applications"],
  endpoints: (builder) => ({
    listApplications: builder.query<Application[], ApplicationListFilters | void>({
      query: (filters) => ({
        url: "/applications",
        params: buildListParams(filters || undefined)
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Applications", id: "LIST" },
              ...result.map((application) => ({ type: "Applications" as const, id: application.id }))
            ]
          : [{ type: "Applications", id: "LIST" }]
    }),
    getApplication: builder.query<Application, number>({
      query: (id) => `/applications/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Applications", id }]
    }),
    createApplication: builder.mutation<Application, ApplicationDraftInput>({
      query: (body) => ({
        url: "/applications",
        method: "POST",
        body
      }),
      invalidatesTags: [{ type: "Applications", id: "LIST" }]
    }),
    updateApplication: builder.mutation<Application, { id: number; body: ApplicationDraftInput }>({
      query: ({ id, body }) => ({
        url: `/applications/${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Applications", id },
        { type: "Applications", id: "LIST" }
      ]
    }),
    submitApplication: builder.mutation<Application, number>({
      query: (id) => ({
        url: `/applications/${id}/submit`,
        method: "POST"
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Applications", id },
        { type: "Applications", id: "LIST" }
      ]
    }),
    startReview: builder.mutation<Application, number>({
      query: (id) => ({
        url: `/applications/${id}/start-review`,
        method: "POST"
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Applications", id },
        { type: "Applications", id: "LIST" }
      ]
    }),
    recordDecision: builder.mutation<Application, { id: number; body: ReviewerDecisionInput }>({
      query: ({ id, body }) => ({
        url: `/applications/${id}/decision`,
        method: "POST",
        body
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Applications", id },
        { type: "Applications", id: "LIST" }
      ]
    })
  })
});

export const {
  useCreateApplicationMutation,
  useGetApplicationQuery,
  useListApplicationsQuery,
  useRecordDecisionMutation,
  useStartReviewMutation,
  useSubmitApplicationMutation,
  useUpdateApplicationMutation
} = applicationsApi;
