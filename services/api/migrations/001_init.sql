CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  workspace TEXT NOT NULL DEFAULT 'live',
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

ALTER TABLE accounts ADD COLUMN IF NOT EXISTS workspace TEXT NOT NULL DEFAULT 'live';

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS patients (
  patient_code TEXT PRIMARY KEY,
  workspace TEXT NOT NULL DEFAULT 'live',
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
  latest_checkup_summary TEXT NOT NULL DEFAULT '',
  latest_checkup_at TIMESTAMPTZ,
  surgery_decision TEXT NOT NULL DEFAULT 'none',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE patients ADD COLUMN IF NOT EXISTS workspace TEXT NOT NULL DEFAULT 'live';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS latest_checkup_summary TEXT NOT NULL DEFAULT '';
ALTER TABLE patients ADD COLUMN IF NOT EXISTS latest_checkup_at TIMESTAMPTZ;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS surgery_decision TEXT NOT NULL DEFAULT 'none';

CREATE TABLE IF NOT EXISTS care_plans (
  id TEXT PRIMARY KEY,
  workspace TEXT NOT NULL DEFAULT 'live',
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

ALTER TABLE care_plans ADD COLUMN IF NOT EXISTS workspace TEXT NOT NULL DEFAULT 'live';

CREATE INDEX IF NOT EXISTS care_plans_patient_status_idx ON care_plans(patient_code, invite_status, created_at DESC);

CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  workspace TEXT NOT NULL DEFAULT 'live',
  patient_code TEXT NOT NULL REFERENCES patients(patient_code) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  variable_name TEXT NOT NULL DEFAULT '',
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  all_day BOOLEAN NOT NULL DEFAULT FALSE,
  medication_id TEXT NOT NULL DEFAULT '',
  recurrence JSONB,
  created_by_user_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS workspace TEXT NOT NULL DEFAULT 'live';
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS variable_name TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS calendar_events_patient_start_idx ON calendar_events(patient_code, start_at);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  workspace TEXT NOT NULL DEFAULT 'live',
  patient_code TEXT NOT NULL REFERENCES patients(patient_code) ON DELETE CASCADE,
  sender_user_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  sender_role TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_messages_patient_created_idx ON chat_messages(patient_code, created_at);

CREATE TABLE IF NOT EXISTS risk_score_entries (
  id TEXT PRIMARY KEY,
  workspace TEXT NOT NULL DEFAULT 'live',
  patient_code TEXT NOT NULL REFERENCES patients(patient_code) ON DELETE CASCADE,
  variable_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  author_user_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS risk_score_entries_patient_created_idx ON risk_score_entries(patient_code, created_at DESC);
