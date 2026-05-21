import { Route, Routes } from "react-router-dom";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ApplicationDetailPage } from "./ApplicationDetailPage";
import { mockFetch } from "../test/fetchMock";
import { makeApplication } from "../test/mockData";
import { renderWithProviders } from "../test/render";

function renderDetail() {
  return renderWithProviders(
    <Routes>
      <Route element={<ApplicationDetailPage />} path="/applications/:id" />
    </Routes>,
    { route: "/applications/1" }
  );
}

describe("ApplicationDetailPage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows draft actions and submits the workflow", async () => {
    const fetchMock = mockFetch([
      { matcher: "/applications/1/submit", method: "POST", body: makeApplication({ status: "submitted" }) },
      { matcher: "/applications/1", body: makeApplication() }
    ]);
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderDetail();

    expect(await screen.findByRole("link", { name: "Edit application" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Application submitted.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(expect.objectContaining({ method: "POST" }));
  });

  it("shows submit mutation errors", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch([
        { matcher: "/applications/1/submit", method: "POST", status: 400, body: { detail: "Only drafts can submit" } },
        { matcher: "/applications/1", body: makeApplication() }
      ])
    );
    const user = userEvent.setup();

    renderDetail();

    await user.click(await screen.findByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Only drafts can submit")).toBeInTheDocument();
  });

  it("shows start review for submitted applications", async () => {
    vi.stubGlobal("fetch", mockFetch([{ matcher: "/applications/1", body: makeApplication({ status: "submitted" }) }]));

    renderDetail();

    expect(await screen.findByRole("button", { name: "Start Review" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Edit application" })).not.toBeInTheDocument();
  });

  it("starts review for submitted applications", async () => {
    const fetchMock = mockFetch([
      { matcher: "/applications/1/start-review", method: "POST", body: makeApplication({ status: "under_review" }) },
      { matcher: "/applications/1", body: makeApplication({ status: "submitted" }) }
    ]);
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderDetail();

    await user.click(await screen.findByRole("button", { name: "Start Review" }));

    expect(await screen.findByText("Review started.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(expect.objectContaining({ method: "POST" }));
  });

  it("shows start review mutation errors", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch([
        { matcher: "/applications/1/start-review", method: "POST", status: 400, body: { detail: "Not submitted" } },
        { matcher: "/applications/1", body: makeApplication({ status: "submitted" }) }
      ])
    );
    const user = userEvent.setup();

    renderDetail();

    await user.click(await screen.findByRole("button", { name: "Start Review" }));

    expect(await screen.findByText("Not submitted")).toBeInTheDocument();
  });

  it("shows reviewer decision controls for under review applications", async () => {
    vi.stubGlobal("fetch", mockFetch([{ matcher: "/applications/1", body: makeApplication({ status: "under_review" }) }]));

    renderDetail();

    expect(await screen.findByRole("button", { name: "Record decision" })).toBeInTheDocument();
    expect(screen.getByLabelText("Approve")).toBeInTheDocument();
    expect(screen.getByLabelText("Need More Information")).toBeInTheDocument();
    expect(screen.getByLabelText("Reject")).toBeInTheDocument();
  });

  it("records reviewer decisions", async () => {
    const fetchMock = mockFetch([
      { matcher: "/applications/1/decision", method: "POST", body: makeApplication({ status: "approved" }) },
      { matcher: "/applications/1", body: makeApplication({ status: "under_review" }) }
    ]);
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderDetail();

    await user.click(await screen.findByRole("button", { name: "Record decision" }));

    expect(await screen.findByText("Reviewer decision recorded.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(expect.objectContaining({ method: "POST" }));
  });

  it("shows reviewer decision mutation errors", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch([
        { matcher: "/applications/1/decision", method: "POST", status: 400, body: { detail: "Decision rejected" } },
        { matcher: "/applications/1", body: makeApplication({ status: "under_review" }) }
      ])
    );
    const user = userEvent.setup();

    renderDetail();

    await user.click(await screen.findByRole("button", { name: "Record decision" }));

    expect(await screen.findAllByText("Decision rejected")).not.toHaveLength(0);
  });

  it("shows edit and resubmit for need more information applications", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch([
        {
          matcher: "/applications/1",
          body: makeApplication({ status: "need_more_information", reviewer_comment: "Add ownership evidence." })
        }
      ])
    );

    renderDetail();

    expect(await screen.findByRole("link", { name: "Edit application" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resubmit" })).toBeInTheDocument();
    expect(screen.getByText("Add ownership evidence.")).toBeInTheDocument();
  });

  it("shows read-only messaging for terminal applications", async () => {
    vi.stubGlobal("fetch", mockFetch([{ matcher: "/applications/1", body: makeApplication({ status: "approved" }) }]));

    renderDetail();

    expect(await screen.findByText("Approved and rejected applications are read-only.")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Edit application" })).not.toBeInTheDocument();
  });

  it("renders API errors", async () => {
    vi.stubGlobal("fetch", mockFetch([{ matcher: "/applications/1", status: 404, body: { detail: "Not found" } }]));

    renderDetail();

    expect(await screen.findByText(/could not be loaded/i)).toBeInTheDocument();
  });
});
