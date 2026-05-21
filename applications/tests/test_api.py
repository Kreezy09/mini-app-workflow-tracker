import pytest

from applications.enums import ApplicationStatus, ApplicationType
from applications.models import Application


pytestmark = pytest.mark.django_db


def post_json(client, path, payload=None):
    """Send a JSON POST request."""

    return client.post(path, data=payload or {}, content_type="application/json")


def put_json(client, path, payload):
    """Send a JSON PUT request."""

    return client.put(path, data=payload, content_type="application/json")


def test_create_application_draft_endpoint(client, draft_payload):
    """Create an application draft through the API."""

    response = post_json(client, "/api/applications", draft_payload)

    assert response.status_code == 201
    body = response.json()
    assert body["tracking_number"].startswith("APP-")
    assert body["status"] == ApplicationStatus.DRAFT.value


def test_create_application_validates_email(client, draft_payload):
    """Reject draft creation with an invalid email."""

    draft_payload["applicant_email"] = "invalid-email"

    response = post_json(client, "/api/applications", draft_payload)

    assert response.status_code == 422


def test_list_applications_endpoint_filters_by_status_type_and_search(client, draft_payload):
    """List applications using supported filters."""

    Application.objects.create(**draft_payload)
    Application.objects.create(
        applicant_name="Another Applicant",
        applicant_email="another@example.com",
        company_name="Other Limited",
        application_type=ApplicationType.RENEWAL.value,
        description="Renewal details",
        status=ApplicationStatus.SUBMITTED.value,
    )

    response = client.get(
        "/api/applications",
        {
            "status": ApplicationStatus.SUBMITTED.value,
            "application_type": ApplicationType.RENEWAL.value,
            "search": "Another",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["applicant_name"] == "Another Applicant"


def test_view_application_details_endpoint(client, application):
    """Get application details through the API."""

    response = client.get(f"/api/applications/{application.id}")

    assert response.status_code == 200
    assert response.json()["id"] == application.id


def test_view_application_details_returns_404(client):
    """Return not found for a missing application."""

    response = client.get("/api/applications/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Application not found."


def test_update_draft_application_endpoint(client, application, draft_payload):
    """Update a draft application through the API."""

    draft_payload["applicant_name"] = "Updated Applicant"

    response = put_json(client, f"/api/applications/{application.id}", draft_payload)

    assert response.status_code == 200
    assert response.json()["applicant_name"] == "Updated Applicant"


def test_update_need_more_information_application_endpoint(client, application, draft_payload):
    """Update a need more information application through the API."""

    application.status = ApplicationStatus.NEED_MORE_INFORMATION.value
    application.save()
    draft_payload["description"] = "Additional details"

    response = put_json(client, f"/api/applications/{application.id}", draft_payload)

    assert response.status_code == 200
    assert response.json()["description"] == "Additional details"


@pytest.mark.parametrize(
    "status",
    [
        ApplicationStatus.APPROVED.value,
        ApplicationStatus.REJECTED.value,
    ],
)
def test_terminal_statuses_cannot_be_edited(client, application, draft_payload, status):
    """Reject edits for terminal applications."""

    application.status = status
    application.save()

    response = put_json(client, f"/api/applications/{application.id}", draft_payload)

    assert response.status_code == 400
    assert "can be edited" in response.json()["detail"]


def test_submit_application_endpoint(client, application):
    """Submit a draft application through the API."""

    response = post_json(client, f"/api/applications/{application.id}/submit")

    assert response.status_code == 200
    assert response.json()["status"] == ApplicationStatus.SUBMITTED.value
    assert response.json()["submitted_at"] is not None


def test_resubmit_need_more_information_endpoint(client, application):
    """Resubmit a need more information application through the API."""

    application.status = ApplicationStatus.NEED_MORE_INFORMATION.value
    application.save()

    response = post_json(client, f"/api/applications/{application.id}/submit")

    assert response.status_code == 200
    assert response.json()["status"] == ApplicationStatus.SUBMITTED.value


def test_submit_rejects_non_editable_status(client, under_review_application):
    """Reject submission for a non-editable application."""

    response = post_json(client, f"/api/applications/{under_review_application.id}/submit")

    assert response.status_code == 400
    assert "can be submitted" in response.json()["detail"]


def test_start_review_endpoint(client, submitted_application):
    """Start review through the API."""

    response = post_json(client, f"/api/applications/{submitted_application.id}/start-review")

    assert response.status_code == 200
    assert response.json()["status"] == ApplicationStatus.UNDER_REVIEW.value


def test_start_review_rejects_draft(client, application):
    """Reject review start for a draft application."""

    response = post_json(client, f"/api/applications/{application.id}/start-review")

    assert response.status_code == 400
    assert "submitted applications" in response.json()["detail"]


def test_record_approved_decision_endpoint(client, under_review_application):
    """Record an approved decision through the API."""

    response = post_json(
        client,
        f"/api/applications/{under_review_application.id}/decision",
        {"status": ApplicationStatus.APPROVED.value},
    )

    assert response.status_code == 200
    assert response.json()["status"] == ApplicationStatus.APPROVED.value


def test_record_need_more_information_decision_requires_comment(client, under_review_application):
    """Require a comment for a need more information decision."""

    response = post_json(
        client,
        f"/api/applications/{under_review_application.id}/decision",
        {"status": ApplicationStatus.NEED_MORE_INFORMATION.value, "reviewer_comment": ""},
    )

    assert response.status_code == 400
    assert "Reviewer comment is required" in response.json()["detail"]


def test_record_rejected_decision_endpoint(client, under_review_application):
    """Record a rejected decision through the API."""

    response = post_json(
        client,
        f"/api/applications/{under_review_application.id}/decision",
        {"status": ApplicationStatus.REJECTED.value, "reviewer_comment": "Insufficient documents"},
    )

    assert response.status_code == 200
    assert response.json()["reviewer_comment"] == "Insufficient documents"


def test_record_decision_rejects_non_under_review(client, submitted_application):
    """Reject decisions for applications not under review."""

    response = post_json(
        client,
        f"/api/applications/{submitted_application.id}/decision",
        {"status": ApplicationStatus.APPROVED.value},
    )

    assert response.status_code == 400
    assert "under review" in response.json()["detail"]


def test_record_decision_rejects_invalid_decision_status(client, under_review_application):
    """Reject unsupported decision statuses."""

    response = post_json(
        client,
        f"/api/applications/{under_review_application.id}/decision",
        {"status": ApplicationStatus.SUBMITTED.value},
    )

    assert response.status_code == 400
    assert "Reviewer decision must be" in response.json()["detail"]
