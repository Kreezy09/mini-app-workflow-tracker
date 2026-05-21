from django.db import IntegrityError, transaction
from django.utils import timezone

from applications.enums import ApplicationStatus
from applications.models import Application


class WorkflowError(Exception):
    """Workflow validation error."""

    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


EDITABLE_STATUSES = {
    ApplicationStatus.DRAFT.value,
    ApplicationStatus.NEED_MORE_INFORMATION.value,
}

TERMINAL_STATUSES = {
    ApplicationStatus.APPROVED.value,
    ApplicationStatus.REJECTED.value,
}

DECISION_STATUSES = {
    ApplicationStatus.NEED_MORE_INFORMATION.value,
    ApplicationStatus.APPROVED.value,
    ApplicationStatus.REJECTED.value,
}

COMMENT_REQUIRED_DECISIONS = {
    ApplicationStatus.NEED_MORE_INFORMATION.value,
    ApplicationStatus.REJECTED.value,
}


def create_draft(data):
    return Application.objects.create(**data)


def list_applications(filters):
    queryset = Application.objects.all()
    status = filters.get("status")
    application_type = filters.get("application_type")
    search = filters.get("search")

    if status:
        queryset = queryset.filter(status=status)
    if application_type:
        queryset = queryset.filter(application_type=application_type)
    if search:
        queryset = queryset.filter(applicant_name__icontains=search)

    return queryset


def get_application(application_id):
    try:
        return Application.objects.get(id=application_id)
    except Application.DoesNotExist as exc:
        raise WorkflowError("Application not found.", status_code=404) from exc


def update_application(application, data):
    if application.status not in EDITABLE_STATUSES:
        raise WorkflowError("Only draft or need more information applications can be edited.")

    for field, value in data.items():
        setattr(application, field, value)

    application.save()
    return application


def submit_application(application):
    if application.status not in EDITABLE_STATUSES:
        raise WorkflowError("Only draft or need more information applications can be submitted.")

    application.status = ApplicationStatus.SUBMITTED.value
    application.submitted_at = timezone.now()
    application.reviewed_at = None
    application.save(update_fields=["status", "submitted_at", "reviewed_at", "updated_at"])
    return application


def start_review(application):
    if application.status != ApplicationStatus.SUBMITTED.value:
        raise WorkflowError("Only submitted applications can move to under review.")

    application.status = ApplicationStatus.UNDER_REVIEW.value
    application.save(update_fields=["status", "updated_at"])
    return application


def record_reviewer_decision(application, status, reviewer_comment=""):
    if application.status != ApplicationStatus.UNDER_REVIEW.value:
        raise WorkflowError("Only under review applications can receive a reviewer decision.")

    if status not in DECISION_STATUSES:
        raise WorkflowError("Reviewer decision must be need_more_information, approved, or rejected.")

    comment = reviewer_comment.strip()
    if status in COMMENT_REQUIRED_DECISIONS and not comment:
        raise WorkflowError("Reviewer comment is required for need more information or rejected decisions.")

    application.status = status
    application.reviewer_comment = comment
    application.reviewed_at = timezone.now()
    application.save(update_fields=["status", "reviewer_comment", "reviewed_at", "updated_at"])
    return application


def create_draft_with_unique_tracking(data):
    for _ in range(3):
        try:
            with transaction.atomic():
                return create_draft(data)
        except IntegrityError:
            continue
    raise WorkflowError("Could not generate a unique tracking number.")
