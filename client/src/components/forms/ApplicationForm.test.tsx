import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ApplicationForm } from "./ApplicationForm";
import type { ApplicationFormValues } from "./ApplicationForm";
import { renderWithProviders } from "../../test/render";

const blankValues: ApplicationFormValues = {
  applicant_name: "",
  applicant_email: "",
  company_name: "",
  application_type: "recordation",
  description: ""
};

describe("ApplicationForm", () => {
  it("shows validation messages for required create and edit fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithProviders(
      <ApplicationForm defaultValues={blankValues} onSubmit={onSubmit} submitLabel="Create draft" />
    );

    await user.click(screen.getByRole("button", { name: "Create draft" }));

    expect(await screen.findByText("Applicant name is required.")).toBeInTheDocument();
    expect(screen.getByText("Company name is required.")).toBeInTheDocument();
    expect(screen.getByText("Description is required.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid form values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithProviders(
      <ApplicationForm defaultValues={blankValues} onSubmit={onSubmit} submitLabel="Create draft" />
    );

    await user.type(screen.getByLabelText("Applicant name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Applicant email"), "ada@example.com");
    await user.type(screen.getByLabelText("Company name"), "Analytical Limited");
    await user.selectOptions(screen.getByLabelText("Application type"), "renewal");
    await user.type(screen.getByLabelText("Description"), "Renewal details");
    await user.click(screen.getByRole("button", { name: "Create draft" }));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        applicant_name: "Ada Lovelace",
        applicant_email: "ada@example.com",
        company_name: "Analytical Limited",
        application_type: "renewal",
        description: "Renewal details"
      },
      expect.anything()
    );
  });
});
