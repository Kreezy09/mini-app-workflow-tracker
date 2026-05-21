from django.db import models

from applications.enums import (
    APPLICATION_STATUS_CHOICES,
    APPLICATION_TYPE_CHOICES,
    ApplicationStatus,
)
from applications.tracking import generate_tracking_number


class Application(models.Model):
    """Application workflow record."""

    tracking_number = models.CharField(max_length=32, unique=True, editable=False)
    applicant_name = models.CharField(max_length=255)
    applicant_email = models.EmailField()
    company_name = models.CharField(max_length=255)
    application_type = models.CharField(max_length=64, choices=APPLICATION_TYPE_CHOICES)
    description = models.TextField()
    status = models.CharField(
        max_length=64,
        choices=APPLICATION_STATUS_CHOICES,
        default=ApplicationStatus.DRAFT.value,
    )
    reviewer_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            self.tracking_number = generate_tracking_number()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.tracking_number
