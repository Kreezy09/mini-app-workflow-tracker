from typing import List, Optional

from ninja import NinjaAPI, Query
from ninja.responses import Status

from applications.enums import ApplicationStatus, ApplicationType
from applications.schemas import (
    ApplicationCreateSchema,
    ApplicationOutSchema,
    ApplicationUpdateSchema,
    ErrorResponse,
    ReviewerDecisionSchema,
)
from applications.services import (
    WorkflowError,
    create_draft_with_unique_tracking,
    get_application,
    list_applications,
    record_reviewer_decision,
    start_review,
    submit_application,
    update_application,
)


api = NinjaAPI(title="Mini Application Workflow Tracker API")


@api.exception_handler(WorkflowError)
def workflow_error_handler(request, exc):
    """Return a structured workflow error response."""

    return api.create_response(request, {"detail": exc.message}, status=exc.status_code)


@api.post("/applications", response={201: ApplicationOutSchema})
def create_application(request, payload: ApplicationCreateSchema):
    """Create an application draft."""

    return Status(201, create_draft_with_unique_tracking(payload.model_dump()))


@api.get("/applications", response=List[ApplicationOutSchema])
def applications_list(
    request,
    status: Optional[ApplicationStatus] = Query(None),
    application_type: Optional[ApplicationType] = Query(None),
    search: Optional[str] = Query(None),
):
    """List applications with optional filters."""

    filters = {
        "status": status.value if status else None,
        "application_type": application_type.value if application_type else None,
        "search": search,
    }
    return list_applications(filters)


@api.get("/applications/{application_id}", response={200: ApplicationOutSchema, 404: ErrorResponse})
def application_detail(request, application_id: int):
    """Get application details."""

    return get_application(application_id)


@api.put("/applications/{application_id}", response={200: ApplicationOutSchema, 400: ErrorResponse, 404: ErrorResponse})
def application_update(request, application_id: int, payload: ApplicationUpdateSchema):
    """Update an editable application."""

    application = get_application(application_id)
    return update_application(application, payload.model_dump())


@api.post("/applications/{application_id}/submit", response={200: ApplicationOutSchema, 400: ErrorResponse, 404: ErrorResponse})
def application_submit(request, application_id: int):
    """Submit or resubmit an application."""

    application = get_application(application_id)
    return submit_application(application)


@api.post("/applications/{application_id}/start-review", response={200: ApplicationOutSchema, 400: ErrorResponse, 404: ErrorResponse})
def application_start_review(request, application_id: int):
    """Start application review."""

    application = get_application(application_id)
    return start_review(application)


@api.post("/applications/{application_id}/decision", response={200: ApplicationOutSchema, 400: ErrorResponse, 404: ErrorResponse})
def application_decision(request, application_id: int, payload: ReviewerDecisionSchema):
    """Record a reviewer decision."""

    application = get_application(application_id)
    return record_reviewer_decision(
        application=application,
        status=payload.status.value,
        reviewer_comment=payload.reviewer_comment or "",
    )
