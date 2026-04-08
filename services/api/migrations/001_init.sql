CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  license_number TEXT NOT NULL DEFAULT '',
  patient_code TEXT UNIQUE,
  avatar_path TEXT NOT NULL DEFAULT '',
  theme_mode TEXT NOT NULL DEFAULT 'blue-medical',
  accent_color TEXT NOT NULL DEFAULT '',
  consent_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  patient_stage TEXT NOT NULL DEFAULT 'empty',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
  patient_code TEXT PRIMARY KEY,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  doctor_account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  procedure TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  compliance INTEGER NOT NULL,
  risk TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  notes TEXT NOT NULL,
  next_appointment TEXT NOT NULL,
  surgery_duration TEXT NOT NULL,
  hospital_stay TEXT NOT NULL,
  last_consultation TEXT NOT NULL,
  streak INTEGER NOT NULL,
  days_until_surgery INTEGER NOT NULL,
  progress JSONB NOT NULL DEFAULT '[]'::jsonb,
  tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  sleep_entries JSONB NOT NULL DEFAULT '[]'::jsonb,
  surgery_decision TEXT NOT NULL DEFAULT 'none',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS care_plans (
  id TEXT PRIMARY KEY,
  patient_code TEXT NOT NULL REFERENCES patients(patient_code) ON DELETE CASCADE,
  invite_id TEXT NOT NULL UNIQUE,
  procedure TEXT NOT NULL,
  surgery_date DATE NOT NULL,
  surgery_document JSONB,
  medications JSONB NOT NULL DEFAULT '[]'::jsonb,
  diet JSONB NOT NULL DEFAULT '[]'::jsonb,
  invite_status TEXT NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS care_plans_patient_status_idx ON care_plans(patient_code, invite_status, created_at DESC);

CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  patient_code TEXT NOT NULL REFERENCES patients(patient_code) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  all_day BOOLEAN NOT NULL DEFAULT FALSE,
  medication_id TEXT NOT NULL DEFAULT '',
  recurrence JSONB,
  created_by_user_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS calendar_events_patient_start_idx ON calendar_events(patient_code, start_at);
