-- Write SQL for new migration 



-- TODO: rename all table names 
-- TODO: clean this file up











CREATE TABLE IF NOT EXISTS "_LEAGUE_SEASON_FORM_FIELDS" (
  "id" SERIAL PRIMARY KEY,
  -- "season_id" INTEGER,      -- REFERENCES seasons(id)
  "registration_template_id" INTEGER,      -- REFERENCES _REGISTRATION_TEMPLATE_BY_ADMIN(id)

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


CREATE TABLE IF NOT EXISTS "_USER_FORM_SUBMISSION_AKA_REGISTRATIONS" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER,      -- REFERENCES users(id)
  -- "season_id" INTEGER,      -- REFERENCES seasons(id)
  "registration_template_id" INTEGER,      -- REFERENCES _REGISTRATION_TEMPLATE_BY_ADMIN(id)
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP
);


CREATE TABLE IF NOT EXISTS "_FORM_SUBMSSION_FIELDS" (
  "id" SERIAL PRIMARY KEY,
  "form_submission_id" INTEGER,      -- REFERENCES _USER_FORM_SUBMISSION_AKA_REGISTRATIONS(id)
  "season_form_field_id" INTEGER,      -- REFERENCES _LEAGUE_SEASON_FORM_FIELDS(id)
  "value" JSON,
  "created_at" TIMESTAMP,
  "updated_at" TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "_REGISTRATION_TEMPLATE_BY_ADMIN" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "is_open" BOOLEAN NOT NULL DEFAULT false,
  "season_id" INTEGER,      -- REFERENCES seasons(id)
  "created_at" TIMESTAMP,
  "created_by" INTEGER,      -- REFERENCES users(id)
  "updated_at" TIMESTAMP
);


CREATE TABLE IF NOT EXISTS "_LEAGUE_SEASON_DEFAULT_FORM_FIELDS" (
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

-- ADD FOREIGN KEYS
ALTER TABLE "_LEAGUE_SEASON_FORM_FIELDS" ADD FOREIGN KEY ("registration_template_id") REFERENCES "_REGISTRATION_TEMPLATE_BY_ADMIN" ("id");
ALTER TABLE "_LEAGUE_SEASON_FORM_FIELDS" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "_USER_FORM_SUBMISSION_AKA_REGISTRATIONS" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "_USER_FORM_SUBMISSION_AKA_REGISTRATIONS" ADD FOREIGN KEY ("registration_template_id") REFERENCES "_REGISTRATION_TEMPLATE_BY_ADMIN" ("id");
ALTER TABLE "_FORM_SUBMSSION_FIELDS" ADD FOREIGN KEY ("form_submission_id") REFERENCES "_USER_FORM_SUBMISSION_AKA_REGISTRATIONS" ("id");
ALTER TABLE "_FORM_SUBMSSION_FIELDS" ADD FOREIGN KEY ("season_form_field_id") REFERENCES "_LEAGUE_SEASON_FORM_FIELDS" ("id");
ALTER TABLE "_REGISTRATION_TEMPLATE_BY_ADMIN" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");

-- CREATE NEW REGISTRATION TEMPLATE BY ADMIN
INSERT INTO "_REGISTRATION_TEMPLATE_BY_ADMIN" ( name, is_open, season_id ) VALUES ( 'test create reg', true, 3 );

-- ADD DEFAULT FIELDS
INSERT INTO "_LEAGUE_SEASON_DEFAULT_FORM_FIELDS" ( field_type, label, is_required, locked, section, section_display_index, display_index ) VALUES ( 'text', 'First Name', true, true, 'Basic Info', 1, 1 );
INSERT INTO "_LEAGUE_SEASON_DEFAULT_FORM_FIELDS" ( field_type, label, is_required, locked, section, section_display_index, display_index ) VALUES ( 'text', 'Last Name', true, true, 'Basic Info', 1, 2 );
INSERT INTO "_LEAGUE_SEASON_DEFAULT_FORM_FIELDS" ( field_type, label, hint, section, section_display_index, display_index ) VALUES ( 'text', 'Phone Number', '222-222-22222', 'Basic Info', 1, 3 );

-- ADD FORM FIELDS MADE BY ADMIN
INSERT INTO "_LEAGUE_SEASON_FORM_FIELDS" (field_type, label, hint, options, is_required, registration_template_id, section, section_display_index, display_index)
SELECT field_type, label, hint, options, is_required, 1, section, section_display_index, display_index FROM "_LEAGUE_SEASON_DEFAULT_FORM_FIELDS";

INSERT INTO "_LEAGUE_SEASON_FORM_FIELDS" ( field_type, label, hint, registration_template_id, section, section_display_index, display_index ) VALUES ( 'text', 'Previous Team', 'Here be a hint/tooltip', 1, 'Sports Info', 2, 2 );
INSERT INTO "_LEAGUE_SEASON_FORM_FIELDS" ( field_type, label, hint, options, registration_template_id, is_required, section, section_display_index, display_index ) VALUES ( 'select', 'Shirt Size', 'Use the dropdown to select a size', '{"XS": "Extra Small", "S": "Small"}', 1, true, 'Sports Info', 2, 3 );
INSERT INTO "_LEAGUE_SEASON_FORM_FIELDS" ( field_type, label, registration_template_id, hint, section, section_display_index, display_index ) VALUES ( 'checkbox', 'Do you also coach?', 1, 'Check the box if you coach any level', 'Sports Info', 2, 3 );

-- REGISTRATION
INSERT INTO "_USER_FORM_SUBMISSION_AKA_REGISTRATIONS" ( user_id, season_id ) VALUES ( 1, 1 );

-- USER FORM SUBMISSION
INSERT INTO "_FORM_SUBMSSION_FIELDS" ( form_submission_id, season_form_field_id, value ) VALUES ( 1, 1, '{"select": "XS"}' );
INSERT INTO "_FORM_SUBMSSION_FIELDS" ( form_submission_id, season_form_field_id, value ) VALUES ( 1, 3, '{"checbox": "true"}' );



-- how to: copy default fields to specific registration
-- used when creating a new registration 
-- INSERT INTO "_LEAGUE_SEASON_FORM_FIELDS" (field_type, label, hint, options, is_required, registration_template_id)
-- SELECT field_type, label, hint, options, is_required, 1 FROM "_LEAGUE_SEASON_DEFAULT_FORM_FIELDS";



-- CREATE TABLE IF NOT EXISTS "template_registrations" (
--   "id" SERIAL PRIMARY KEY,
--   "name" VARCHAR,
--   "is_open" BOOLEAN NOT NULL DEFAULT false,
--   "season_id" INTEGER,      -- REFERENCES seasons(id)
-- --   "last_name" VARCHAR,
-- --   "email" VARCHAR,
-- --   "is_suspended" BOOLEAN NOT NULL DEFAULT false,
-- --   "suspended_at" TIMESTAMP,
-- --   "invite_token" VARCHAR,
-- --   "invite_date" TIMESTAMP,
-- --   "reinvite_date" TIMESTAMP,
-- --   "last_login" TIMESTAMP,
--   "created_at" TIMESTAMP,
--   "created_by" INTEGER      -- REFERENCES users(id)
-- );

-- ALTER TABLE "template_registrations" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
-- ALTER TABLE "template_registrations" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");
