import pytest

from applications.enums import ApplicationStatus, ApplicationType
from applications.models import Application
from applications.services import (
    WorkflowError,
    create_draft_with_unique_tracking,
    get_application,
    record_reviewer_decision,
    start_review,
    submit_application,
    update_application,
)


pytestmark = pytest.mark.django_db


def test_create_draft_generates_tracking_number(draft_payload):
    """Create drafts with generated tracking numbers."""

    application = create_draft_with_unique_tracking(draft_payload)

    assert application.tracking_number.startswith("APP-")
    assert application.status == ApplicationStatus.DRAFT.value


def test_get_application_raises_for_missing_application():
    """Raise a workflow error for missing applications."""

    with pytest.raises(WorkflowError) as exc:
        get_application(999)

    assert exc.value.status_code == 404
    assert exc.value.message == "Application not found."


def test_update_application_allows_draft(application):
    """Allow draft application updates."""

    updated = update_application(
        application,
        {
            "applicant_name": "Updated Applicant",
            "applicant_email": "updated@example.com",
            "company_name": "Updated Limited",
            "application_type": ApplicationType.RENEWAL.value,
            "description": "Updated description",
        },
    )

    assert updated.applicant_name == "Updated Applicant"
    assert updated.application_type == ApplicationType.RENEWAL.value


def test_update_application_allows_need_more_information(application):
    """Allow updates for need more information applications."""

    application.status = ApplicationStatus.NEED_MORE_INFORMATION.value
    application.save()

    updated = update_application(
        application,
        {
            "applicant_name": "Resubmitter",
            "applicant_email": "resubmitter@example.com",
            "company_name": "Resubmit Limited",
            "application_type": ApplicationType.CHANGE_OF_NAME.value,
            "description": "More information supplied",
        },
    )

    assert updated.description == "More information supplied"


@pytest.mark.parametrize(
    "status",
    [
        ApplicationStatus.SUBMITTED.value,
        ApplicationStatus.UNDER_REVIEW.value,
        ApplicationStatus.APPROVED.value,
        ApplicationStatus.REJECTED.value,
    ],
)
def test_update_application_rejects_non_editable_statuses(application, status, draft_payload):
    """Reject updates for non-editable statuses."""

    application.status = status
    application.save()

    with pytest.raises(WorkflowError):
        update_application(application, draft_payload)


def test_submit_application_allows_draft_and_sets_timestamp(application):
    """Allow draft submission and set a submission timestamp."""

    submitted = submit_application(application)

    assert submitted.status == ApplicationStatus.SUBMITTED.value
    assert submitted.submitted_at is not None


def test_submit_application_allows_need_more_information(application):
    """Allow resubmission from need more information."""

    application.status = ApplicationStatus.NEED_MORE_INFORMATION.value
    application.save()

    submitted = submit_application(application)

    assert submitted.status == ApplicationStatus.SUBMITTED.value


def test_submit_application_rejects_under_review(under_review_application):
    """Reject submission for under review applications."""

    with pytest.raises(WorkflowError):
        submit_application(under_review_application)


def test_start_review_allows_submitted(submitted_application):
    """Allow submitted applications to start review."""

    reviewed = start_review(submitted_application)

    assert reviewed.status == ApplicationStatus.UNDER_REVIEW.value


def test_start_review_rejects_draft(application):
    """Reject review start for draft applications."""

    with pytest.raises(WorkflowError):
        start_review(application)


@pytest.mark.parametrize(
    "decision",
    [
        ApplicationStatus.NEED_MORE_INFORMATION.value,
        ApplicationStatus.APPROVED.value,
        ApplicationStatus.REJECTED.value,
    ],
)
def test_record_reviewer_decision_allows_supported_decisions(under_review_application, decision):
    """Allow supported reviewer decisions."""

    comment = "Reviewer comment" if decision != ApplicationStatus.APPROVED.value else ""

    decided = record_reviewer_decision(under_review_application, decision, comment)

    assert decided.status == decision
    assert decided.reviewed_at is not None


def test_record_reviewer_decision_requires_under_review(application):
    """Require under review status for decisions."""

    with pytest.raises(WorkflowError):
        record_reviewer_decision(application, ApplicationStatus.APPROVED.value)


def test_record_reviewer_decision_rejects_unsupported_status(under_review_application):
    """Reject unsupported reviewer decision statuses."""

    with pytest.raises(WorkflowError) as exc:
        record_reviewer_decision(under_review_application, ApplicationStatus.SUBMITTED.value)

    assert "Reviewer decision must be" in exc.value.message


@pytest.mark.parametrize(
    "decision",
    [
        ApplicationStatus.NEED_MORE_INFORMATION.value,
        ApplicationStatus.REJECTED.value,
    ],
)
def test_record_reviewer_decision_requires_comment_for_specific_decisions(under_review_application, decision):
    """Require reviewer comments for selected decisions."""

    with pytest.raises(WorkflowError) as exc:
        record_reviewer_decision(under_review_application, decision, " ")

    assert "Reviewer comment is required" in exc.value.message


def test_tracking_number_is_unique_for_multiple_applications(draft_payload):
    """Generate unique tracking numbers for applications."""

    first = Application.objects.create(**draft_payload)
    second = Application.objects.create(**draft_payload)

    assert first.tracking_number != second.tracking_number
