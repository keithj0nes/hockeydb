-- Write SQL for new migration 

-- _LEAGUE_SEASON_DEFAULT_FORM_FIELDS
CREATE TABLE IF NOT EXISTS "registrations_default_fields" (
  "id" SERIAL PRIMARY KEY,
  "field_type" VARCHAR,
  "label" VARCHAR,
  "hint" VARCHAR,
  "options" JSON,
  "locked" BOOLEAN NOT NULL DEFAULT false,
  "section" VARCHAR,
  "section_display_index" INTEGER NOT NULL DEFAULT 1,
  "is_required" BOOLEAN NOT NULL DEFAULT false,
  "display_index" INTEGER NOT NULL DEFAULT 1
);

-- _LEAGUE_SEASON_FORM_FIELDS
CREATE TABLE IF NOT EXISTS "registrations_fields" (
  "id" SERIAL PRIMARY KEY,
  -- "season_id" INTEGER,      -- REFERENCES seasons(id)
  "registration_template_id" INTEGER,      -- REFERENCES registrations_templates(id)
  "field_type" VARCHAR,
  "label" VARCHAR,
  "hint" VARCHAR,
  "options" JSON,
  "is_required" BOOLEAN NOT NULL DEFAULT false,
  "display_index" INTEGER NOT NULL DEFAULT 1,
  "section_display_index" INTEGER NOT NULL DEFAULT 1,
  "locked" BOOLEAN NOT NULL DEFAULT false,
  "section" VARCHAR,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,      -- REFERENCES users(id)
  "updated_at" TIMESTAMP
);

-- _REGISTRATION_TEMPLATE_BY_ADMIN
CREATE TABLE IF NOT EXISTS "registrations_templates" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "is_open" BOOLEAN NOT NULL DEFAULT false,
  "season_id" INTEGER,      -- REFERENCES seasons(id)
  "max_spots" INTEGER, -- default null
  "show_max_spots" BOOLEAN DEFAULT true,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,      -- REFERENCES users(id)
  "updated_at" TIMESTAMP
);

-- _USER_FORM_SUBMISSION_AKA_REGISTRATIONS
-- _FORM_SUBMSSION_FIELDS
CREATE TABLE IF NOT EXISTS "registrations_submissions" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER,      -- REFERENCES users(id)
  "player_id" INTEGER,          -- REFERENCES players(id)
  "registration_template_id" INTEGER, --REFERENCES registrations_templates(id)
  "value" JSON,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP,
  "submitted_at" TIMESTAMP
);

-- ADD FOREIGN KEYS
ALTER TABLE "registrations_fields" ADD FOREIGN KEY ("registration_template_id") REFERENCES "registrations_templates" ("id");
ALTER TABLE "registrations_fields" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "registrations_submissions" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "registrations_submissions" ADD FOREIGN KEY ("registration_template_id") REFERENCES "registrations_templates" ("id");
ALTER TABLE "registrations_submissions" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");
ALTER TABLE "registrations_templates" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");
