# Mini Application Workflow Tracker

Django + React application workflow tracker for creating application drafts, submitting them, reviewing them, and recording reviewer decisions.

## Author

- Keith Mwaniki Kareithi
- `keithkareithi09@gmail.com`

## Tech Stack

- Backend: Django 5, Django Ninja, SQLite
- Frontend: React, TypeScript, Vite, React Router, Redux Toolkit Query, Redux Toolkit
- Forms and validation: React Hook Form, Zod
- Styling: Tailwind CSS
- Backend tests: pytest, pytest-django, pytest-cov
- Frontend tests: Vitest, React Testing Library

## Backend Setup

Create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install backend dependencies:

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

## Frontend Setup

Install frontend dependencies:

```bash
cd client
npm install
```

Configure environment variables:

```bash
cp .env.example .env
```

Required frontend environment variables:

- `VITE_API_BASE_URL`: API base URL. Defaults to `/api`.

Run the frontend development server:

```bash
npm run dev
```

With the backend running on `http://127.0.0.1:8000`, Vite proxies `/api` requests to the Django server.

Build the frontend:

```bash
npm run build
```

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

## Frontend Routes

- `/` application workflow dashboard.
- `/applications/new` create application draft.
- `/applications/:id` application detail and workflow actions.
- `/applications/:id/edit` edit draft or need more information application.

## Workflow Rules

- Draft applications can be edited and submitted.
- Submitted applications can move to under review.
- Under review applications can receive reviewer decisions.
- Need more information applications can be edited and resubmitted.
- Approved and rejected applications cannot be edited.
- Need more information and rejected decisions require a reviewer comment.

## Tests and Coverage

Run backend tests:

```bash
pytest
```

Run backend coverage:

```bash
pytest --cov=applications --cov-report=term-missing --cov-fail-under=90
```

Run frontend tests:

```bash
cd client
npm test
```

Run frontend coverage:

```bash
npm run coverage
```

Run frontend type checking and linting:

```bash
npm run typecheck
npm run lint
```

Current verification results:

```text
Backend: 40 passed, 97.88% coverage
Frontend: 35 passed, 96.05% statement coverage, 95.97% line coverage
```

Coverage settings are configured in `.coveragerc`, `pytest.ini`, and `client/vite.config.ts`.

## Assumptions

- SQLite is used for local backend simplicity.
- API enum values use stable machine-readable strings such as `under_review`.
- `Need More Information` is treated as editable and resubmittable, following the explicit workflow rule.
- Authentication, authorization, and reviewer identity are out of scope.
- The frontend uses `VITE_API_BASE_URL=/api` by default and relies on Vite proxying during local development.

## Possible Improvements

- Add authentication and role-based permissions for applicants and reviewers.
- Add pagination, sorting, and richer filtering for larger datasets.
- Add audit history for every workflow transition.
- Add PostgreSQL settings for production deployments.
- Add toast notifications and optimistic workflow transitions.
- Add end-to-end tests against a running Django server.

## Walkthrough Video

- [Brief app walkthrough video](https://drive.google.com/file/d/1Q2OSFqpzeAsxTCjqgX3IutD5_mUzF5dw/view?usp=sharing)
