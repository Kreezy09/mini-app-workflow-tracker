# Mini Application Workflow Tracker Backend

Django backend API for tracking application workflows from draft creation through review decisions.

## Tech Stack

- Django 5
- Django Ninja
- SQLite for local development
- pytest, pytest-django, pytest-cov

## Setup

Create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start the backend server:

```bash
python manage.py runserver
```

The API is available at `http://127.0.0.1:8000/api/`.

Django Ninja interactive docs are available at `http://127.0.0.1:8000/api/docs`.

The `client/` directory is reserved for the future frontend and currently contains no frontend code.

## API Endpoints

- `POST /api/applications` creates an application draft.
- `GET /api/applications` lists applications.
- `GET /api/applications/{id}` shows application details.
- `PUT /api/applications/{id}` updates an editable application.
- `POST /api/applications/{id}/submit` submits or resubmits an application.
- `POST /api/applications/{id}/start-review` moves a submitted application to under review.
- `POST /api/applications/{id}/decision` records a reviewer decision.

List filters:

- `status`
- `application_type`
- `search`

Allowed application types:

- `recordation`
- `renewal`
- `change_of_ownership`
- `change_of_name`
- `discontinuation`

Allowed statuses:

- `draft`
- `submitted`
- `under_review`
- `need_more_information`
- `approved`
- `rejected`

## Workflow Rules

- Draft applications can be edited and submitted.
- Submitted applications can move to under review.
- Under review applications can receive reviewer decisions.
- Need more information applications can be edited and resubmitted.
- Approved and rejected applications cannot be edited.
- Need more information and rejected decisions require a reviewer comment.

## Tests and Coverage

Run tests:

```bash
pytest
```

Run coverage explicitly:

```bash
pytest --cov=applications --cov-report=term-missing --cov-fail-under=90
```

Current result:

```text
40 passed
Total coverage: 97.88%
```

Coverage settings are configured in `.coveragerc` and `pytest.ini`.

## Assumptions

- This implementation is backend-only; no frontend was built.
- SQLite is used for local simplicity.
- API enum values use stable machine-readable strings such as `under_review`.
- `Need More Information` is treated as editable and resubmittable, following the explicit workflow rule.
- Authentication, authorization, and reviewer identity are out of scope for this take-home backend.

## Possible Improvements

- Add authentication and role-based permissions for applicants and reviewers.
- Add pagination and richer filtering for larger datasets.
- Add audit history for every workflow transition.
- Add PostgreSQL settings for production deployments.
- Add request throttling and structured logging.
