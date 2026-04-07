# Frontend Information Architecture

## Route map

- `/patient/login`
- `/patient/register`
- `/patient/invite`
- `/patient/surgery`
- `/patient/consent`
- `/patient/dashboard`
- `/patient/checklist`
- `/patient/progress`
- `/doctor/login`
- `/doctor/register`
- `/doctor/dashboard`
- `/doctor/patients/new`
- `/doctor/patients/:id`
- `/doctor/patients/:id/calendar`

## App structure

- `src/app`: router, guards, and layouts
- `src/modules/auth`: login and registration entry points for both roles
- `src/modules/patient`: patient onboarding, consent, dashboard, checklist, and progress views
- `src/modules/doctor`: doctor dashboard, patient detail, calendar, and add-patient workflow
- `src/services`: typed gateway contracts, mock adapters, and fixtures
- `src/stores`: session, patient, and doctor state
- `src/components`: reusable inputs, buttons, and charts

## Backend handoff notes

- Patient and doctor flows already consume async gateway interfaces.
- Replacing mocks with HTTP clients should happen inside `src/services/adapters`.
- Patient consent gating and role-based redirects are centralized in the session store and route access guard.
- The Go API should eventually own auth, patient summaries, task updates, and protocol assignment.
- The Python AI service should eventually own readiness insights, trend scoring, and intervention recommendations.
