import { Route, Routes } from "react-router-dom";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ApplicationEditPage } from "./ApplicationEditPage";
import { mockFetch } from "../test/fetchMock";
import { makeApplication } from "../test/mockData";
import { renderWithProviders } from "../test/render";

function renderEdit() {
  return renderWithProviders(
    <Routes>
      <Route element={<ApplicationEditPage />} path="/applications/:id/edit" />
    </Routes>,
    { route: "/applications/1/edit" }
  );
}

describe("ApplicationEditPage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("updates an editable application through RTK Query", async () => {
    const fetchMock = mockFetch([
      { matcher: "/applications/1", method: "PUT", body: makeApplication({ applicant_name: "Updated Applicant" }) },
      { matcher: "/applications/1", body: makeApplication() }
    ]);
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderEdit();

    const nameInput = await screen.findByLabelText("Applicant name");
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Applicant");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.objectContaining({ method: "PUT" })));
  });

  it("shows update mutation errors", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch([
        { matcher: "/applications/1", method: "PUT", status: 400, body: { detail: "Only editable applications can change" } },
        { matcher: "/applications/1", body: makeApplication() }
      ])
    );
    const user = userEvent.setup();

    renderEdit();

    await user.click(await screen.findByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Only editable applications can change")).toBeInTheDocument();
  });

  it("shows load errors", async () => {
    vi.stubGlobal("fetch", mockFetch([{ matcher: "/applications/1", status: 500, body: { detail: "Server down" } }]));

    renderEdit();

    expect(await screen.findByText("Unable to load application")).toBeInTheDocument();
  });

  it("prevents editing terminal applications", async () => {
    vi.stubGlobal("fetch", mockFetch([{ matcher: "/applications/1", body: makeApplication({ status: "rejected" }) }]));

    renderEdit();

    expect(await screen.findByText("Application cannot be edited")).toBeInTheDocument();
  });
});
