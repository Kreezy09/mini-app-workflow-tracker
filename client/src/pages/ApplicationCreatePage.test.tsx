import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ApplicationCreatePage } from "./ApplicationCreatePage";
import { mockFetch } from "../test/fetchMock";
import { makeApplication } from "../test/mockData";
import { renderWithProviders } from "../test/render";

describe("ApplicationCreatePage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates an application draft through RTK Query", async () => {
    const fetchMock = mockFetch([{ matcher: "/applications", method: "POST", status: 201, body: makeApplication() }]);
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    renderWithProviders(<ApplicationCreatePage />);

    await user.type(screen.getByLabelText("Applicant name"), "Jane Applicant");
    await user.type(screen.getByLabelText("Applicant email"), "jane@example.com");
    await user.type(screen.getByLabelText("Company name"), "Example Limited");
    await user.type(screen.getByLabelText("Description"), "Recordation application details");
    await user.click(screen.getByRole("button", { name: "Create draft" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.objectContaining({ method: "POST" })));
  });

  it("shows mutation errors", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch([{ matcher: "/applications", method: "POST", status: 400, body: { detail: "Invalid draft" } }])
    );
    const user = userEvent.setup();

    renderWithProviders(<ApplicationCreatePage />);

    await user.type(screen.getByLabelText("Applicant name"), "Jane Applicant");
    await user.type(screen.getByLabelText("Applicant email"), "jane@example.com");
    await user.type(screen.getByLabelText("Company name"), "Example Limited");
    await user.type(screen.getByLabelText("Description"), "Recordation application details");
    await user.click(screen.getByRole("button", { name: "Create draft" }));

    expect(await screen.findByText("Invalid draft")).toBeInTheDocument();
  });
});
