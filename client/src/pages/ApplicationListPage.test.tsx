import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ApplicationListPage } from "./ApplicationListPage";
import { mockFetch } from "../test/fetchMock";
import { makeApplication } from "../test/mockData";
import { renderWithProviders } from "../test/render";

describe("ApplicationListPage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders application rows from the API", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch([
        {
          matcher: "/applications",
          body: [
            makeApplication(),
            makeApplication({
              id: 2,
              tracking_number: "APP-000002",
              applicant_name: "Grace Hopper",
              company_name: "Compiler Works",
              application_type: "renewal",
              status: "under_review"
            })
          ]
        }
      ])
    );

    renderWithProviders(<ApplicationListPage />);

    expect(await screen.findAllByText("APP-000001")).not.toHaveLength(0);
    expect(screen.getAllByText("Grace Hopper")).not.toHaveLength(0);
    expect(screen.getAllByText("Under Review")).not.toHaveLength(0);
    expect(screen.getAllByText("Renewal")).not.toHaveLength(0);
  });

  it("renders an empty state", async () => {
    vi.stubGlobal("fetch", mockFetch([{ matcher: "/applications", body: [] }]));

    renderWithProviders(<ApplicationListPage />);

    expect(await screen.findByText("No applications found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create the first draft" })).toBeInTheDocument();
  });

  it("renders API errors and supports retry", async () => {
    const fetchMock = mockFetch([{ matcher: "/applications", status: 500, body: { detail: "Server unavailable" } }]);
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderWithProviders(<ApplicationListPage />);

    expect(await screen.findByText(/could not be loaded/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("refetches when filters change", async () => {
    const fetchMock = mockFetch([{ matcher: "/applications", body: [] }]);
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderWithProviders(<ApplicationListPage />);

    await screen.findByText("No applications found");
    await user.type(screen.getByLabelText("Search applicants"), "Jane");
    await user.selectOptions(screen.getByLabelText("Filter by status"), "submitted");
    await user.selectOptions(screen.getByLabelText("Filter by application type"), "renewal");

    expect(fetchMock).toHaveBeenCalled();
    const urls = fetchMock.mock.calls.map(([request]) => (request as Request).url);
    expect(urls.some((url) => url.includes("search=Jane"))).toBe(true);
    expect(urls.some((url) => url.includes("status=submitted"))).toBe(true);
    expect(urls.some((url) => url.includes("application_type=renewal"))).toBe(true);
  });
});
