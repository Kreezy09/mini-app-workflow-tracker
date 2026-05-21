from datetime import datetime
from typing import Optional

from ninja import Schema
from pydantic import EmailStr, Field

from applications.enums import ApplicationStatus, ApplicationType


class ErrorResponse(Schema):
    """Error response payload."""

    detail: str


class ApplicationCreateSchema(Schema):
    """Application draft creation payload."""

    applicant_name: str = Field(min_length=1, max_length=255)
    applicant_email: EmailStr
    company_name: str = Field(min_length=1, max_length=255)
    application_type: ApplicationType
    description: str = Field(min_length=1)


class ApplicationUpdateSchema(Schema):
    """Editable application payload."""

    applicant_name: str = Field(min_length=1, max_length=255)
    applicant_email: EmailStr
    company_name: str = Field(min_length=1, max_length=255)
    application_type: ApplicationType
    description: str = Field(min_length=1)


class ReviewerDecisionSchema(Schema):
    """Reviewer decision payload."""

    status: ApplicationStatus
    reviewer_comment: Optional[str] = ""


class ApplicationOutSchema(Schema):
    """Application response payload."""

    id: int
    tracking_number: str
    applicant_name: str
    applicant_email: str
    company_name: str
    application_type: str
    description: str
    status: str
    reviewer_comment: str
    created_at: datetime
    updated_at: datetime
    submitted_at: Optional[datetime]
    reviewed_at: Optional[datetime]
