from enum import Enum


class ApplicationType(str, Enum):
    """Supported application type values."""

    RECORDATION = "recordation"
    RENEWAL = "renewal"
    CHANGE_OF_OWNERSHIP = "change_of_ownership"
    CHANGE_OF_NAME = "change_of_name"
    DISCONTINUATION = "discontinuation"


class ApplicationStatus(str, Enum):
    """Supported application workflow status values."""

    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    NEED_MORE_INFORMATION = "need_more_information"
    APPROVED = "approved"
    REJECTED = "rejected"


APPLICATION_TYPE_CHOICES = [
    (ApplicationType.RECORDATION.value, "Recordation"),
    (ApplicationType.RENEWAL.value, "Renewal"),
    (ApplicationType.CHANGE_OF_OWNERSHIP.value, "Change of Ownership"),
    (ApplicationType.CHANGE_OF_NAME.value, "Change of Name"),
    (ApplicationType.DISCONTINUATION.value, "Discontinuation"),
]

APPLICATION_STATUS_CHOICES = [
    (ApplicationStatus.DRAFT.value, "Draft"),
    (ApplicationStatus.SUBMITTED.value, "Submitted"),
    (ApplicationStatus.UNDER_REVIEW.value, "Under Review"),
    (ApplicationStatus.NEED_MORE_INFORMATION.value, "Need More Information"),
    (ApplicationStatus.APPROVED.value, "Approved"),
    (ApplicationStatus.REJECTED.value, "Rejected"),
]
