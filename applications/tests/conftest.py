import pytest

from applications.enums import ApplicationStatus, ApplicationType
from applications.models import Application


@pytest.fixture
def draft_payload():
    """Return a valid draft payload."""

    return {
        "applicant_name": "Jane Applicant",
        "applicant_email": "jane@example.com",
        "company_name": "Example Limited",
        "application_type": ApplicationType.RECORDATION.value,
        "description": "Recordation application details",
    }


@pytest.fixture
def application(db, draft_payload):
    """Create a draft application."""

    return Application.objects.create(**draft_payload)


@pytest.fixture
def submitted_application(db, draft_payload):
    """Create a submitted application."""

    return Application.objects.create(
        **draft_payload,
        status=ApplicationStatus.SUBMITTED.value,
    )


@pytest.fixture
def under_review_application(db, draft_payload):
    """Create an under review application."""

    return Application.objects.create(
        **draft_payload,
        status=ApplicationStatus.UNDER_REVIEW.value,
    )
