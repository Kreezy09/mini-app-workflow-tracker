import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ReviewerDecisionForm } from "./ReviewerDecisionForm";

describe("ReviewerDecisionForm", () => {
  it("requires comments for rejected decisions", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<ReviewerDecisionForm onSubmit={onSubmit} />);

    await user.click(screen.getByLabelText("Reject"));
    await user.click(screen.getByRole("button", { name: "Record decision" }));

    expect(await screen.findByText("Reviewer comment is required for this decision.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("allows approval without a comment", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<ReviewerDecisionForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Record decision" }));

    expect(onSubmit).toHaveBeenCalledWith({
      status: "approved",
      reviewer_comment: ""
    });
  });

  it("submits need more information with a comment", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<ReviewerDecisionForm onSubmit={onSubmit} />);

    await user.click(screen.getByLabelText("Need More Information"));
    await user.type(screen.getByLabelText("Reviewer comment"), "Please upload supporting documents.");
    await user.click(screen.getByRole("button", { name: "Record decision" }));

    expect(onSubmit).toHaveBeenCalledWith({
      status: "need_more_information",
      reviewer_comment: "Please upload supporting documents."
    });
  });
});
