--==--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--
--==--==--==--==--==--    Create Tables    --==--==--==--==--==--
--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--==--

CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR,
  "last_name" VARCHAR,
  "email" VARCHAR,
  "is_suspended" BOOLEAN NOT NULL DEFAULT false,
  "suspended_at" TIMESTAMP,
  "invite_token" VARCHAR,
  "invite_date" TIMESTAMP,
  "reinvite_date" TIMESTAMP,
  "last_login" TIMESTAMP,
  "created_at" TIMESTAMP,
  "created_by" INTEGER      -- REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS "passwords" (
  "id" SERIAL PRIMARY KEY, 
  "user_id" INTEGER,        -- REFERENCES users(id),
  "salt" VARCHAR,
  "pw" VARCHAR
);

CREATE TABLE IF NOT EXISTS "roles" (
  "id" SERIAL PRIMARY KEY, 
  "name" VARCHAR,
  "description" VARCHAR
);

CREATE TABLE IF NOT EXISTS "user_role" (
  "id" SERIAL PRIMARY KEY, 
  "user_id" INTEGER NOT NULL,
  "role_id" INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS "news" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR,
  "allow_collapse" BOOLEAN NOT NULL DEFAULT false,
  "body" VARCHAR,
  "display_order" INTEGER,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_at" TIMESTAMP,
  "deleted_by" INTEGER,        -- REFERENCES users(id),
  "hidden_at" TIMESTAMP,
  "hidden_by" INTEGER          -- REFERENCES users(id),
);

CREATE TABLE IF NOT EXISTS "tags" (
  "id" SERIAL PRIMARY KEY, 
  "name" VARCHAR
);

CREATE TABLE IF NOT EXISTS "news_tags" (
  "id" SERIAL PRIMARY KEY,
  "tag_id" INTEGER,           -- REFERENCES tags(id)
  "news_id" INTEGER           -- REFERENCES news(id)
);

CREATE TABLE IF NOT EXISTS "players" (
  "id"  SERIAL PRIMARY KEY,
  "first_name" VARCHAR(255),
  "last_name" VARCHAR(255),
  "email" VARCHAR(255),
  "registered_date" TIMESTAMP,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_at" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE IF NOT EXISTS "player_stats" (
  "id" SERIAL PRIMARY KEY,
  "player_id" INTEGER,         -- REFERENCES players(id)
  "team_id" INTEGER,           -- REFERENCES teams(id)
  "season_id" INTEGER,         -- REFERENCES seasons(id)
  "player_number" INTEGER NOT NULL DEFAULT 0,
  "games_played" INTEGER NOT NULL DEFAULT 0,
  "goals" INTEGER NOT NULL DEFAULT 0,
  "assists" INTEGER NOT NULL DEFAULT 0,
  "points" INTEGER NOT NULL DEFAULT 0,
  "penalties_in_minutes" INTEGER NOT NULL DEFAULT 0,
  "game_winning_goals" INTEGER NOT NULL DEFAULT 0,
  "power_play_goals" INTEGER NOT NULL DEFAULT 0,
  "short_handed_goals" INTEGER NOT NULL DEFAULT 0,
  "goals_per_game" INTEGER NOT NULL DEFAULT 0,
  "assists_per_game" INTEGER NOT NULL DEFAULT 0,
  "points_per_game" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "seasons" (
  "id"  SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "type" VARCHAR,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_at" TIMESTAMP,
  "deleted_by" INTEGER,        -- REFERENCES users(id),
  "hidden_at" TIMESTAMP,
  "hidden_by" INTEGER,         -- REFERENCES users(id),
  "is_active" BOOLEAN NOT NULL DEFAULT false
);


CREATE TABLE "divisions" (
  "id"  SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "season_id" INTEGER,         -- REFERENCES seasons(id)
  "created_at" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_at" TIMESTAMP,
  "deleted_by" INTEGER,        -- REFERENCES users(id),
  "hidden_at" TIMESTAMP,
  "hidden_by" INTEGER          -- REFERENCES users(id),
);

CREATE TABLE "teams" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "colors" JSONB,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_at" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "team_season_division" (
  "id" SERIAL PRIMARY KEY,
  "team_id" INTEGER,           -- REFERENCES teams(id)
  "season_id" INTEGER,         -- REFERENCES seasons(id)
  "division_id" INTEGER,       -- REFERENCES divisions(id)
  "games_played" INTEGER NOT NULL DEFAULT 0,
  "wins" INTEGER NOT NULL DEFAULT 0,
  "losses" INTEGER NOT NULL DEFAULT 0,
  "ties" INTEGER NOT NULL DEFAULT 0,
  -- "overtime_losses" INTEGER NOT NULL DEFAULT 0,
  "points" INTEGER NOT NULL DEFAULT 0,
  "goals_for" INTEGER NOT NULL DEFAULT 0,
  "goals_against" INTEGER NOT NULL DEFAULT 0,
  "penalties_in_minutes" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "game_season_division" (
  "id" SERIAL PRIMARY KEY,
  "game_id" INTEGER,           -- REFERENCES games(id)
  "season_id" INTEGER,         -- REFERENCES seasons(id)
  "division_id" INTEGER        -- REFERENCES divisions(id)
);

CREATE TABLE "player_team_season" (
  "id" SERIAL PRIMARY KEY,
  "player_id" INTEGER,        -- REFERENCES players(id)
  "team_id" INTEGER,          -- REFERENCES teams(id)
  "season_id" INTEGER         -- REFERENCES seasons(id)
);

CREATE TABLE "locations" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "address" VARCHAR,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_at" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "games" (
  "id" SERIAL PRIMARY KEY,
  "has_been_played" BOOLEAN NOT NULL DEFAULT false,
  "home_team" INTEGER,           -- REFERENCES teams(id)
  "away_team" INTEGER,           -- REFERENCES teams(id)
  "location_id" INTEGER,         -- REFERENCES locations(id)
  "scorekeeper_id" INTEGER,      -- REFERENCES users(id)
  "start_date" TIMESTAMP,
  "home_score" INTEGER NOT NULL DEFAULT 0,
  "home_first_score" INTEGER NOT NULL DEFAULT 0,
  "home_second_score" INTEGER NOT NULL DEFAULT 0,
  "home_third_score" INTEGER NOT NULL DEFAULT 0,
  "home_first_sog" INTEGER NOT NULL DEFAULT 0,
  "home_second_sog" INTEGER NOT NULL DEFAULT 0,
  "home_third_sog" INTEGER NOT NULL DEFAULT 0,
  "home_first_pim" INTEGER NOT NULL DEFAULT 0,
  "home_second_pim" INTEGER NOT NULL DEFAULT 0,
  "home_third_pim" INTEGER NOT NULL DEFAULT 0,
  "away_score" INTEGER NOT NULL DEFAULT 0,
  "away_first_score" INTEGER NOT NULL DEFAULT 0,
  "away_second_score" INTEGER NOT NULL DEFAULT 0,
  "away_third_score" INTEGER NOT NULL DEFAULT 0,
  "away_first_sog" INTEGER NOT NULL DEFAULT 0,
  "away_second_sog" INTEGER NOT NULL DEFAULT 0,
  "away_third_sog" INTEGER NOT NULL DEFAULT 0,
  "away_first_pim" INTEGER NOT NULL DEFAULT 0,
  "away_second_pim" INTEGER NOT NULL DEFAULT 0,
  "away_third_pim" INTEGER NOT NULL DEFAULT 0,
  "game_notes" VARCHAR,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_at" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "registrations" (
  "id"  SERIAL PRIMARY KEY,
  "user_id" INTEGER,            -- REFERENCES users(id),
  "player_id" INTEGER,          -- REFERENCES players(id),
  "season_id" INTEGER,          -- REFERENCES seasons(id),
  "payment_frequency" VARCHAR(255) NOT NULL DEFAULT 'full', -- monthly / half / full
  "paid_amount" INTEGER NOT NULL DEFAULT 0,
  "paid_at" TIMESTAMP,
  "completed_at" TIMESTAMP,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_at" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "settings" (
  "id" SERIAL PRIMARY KEY,
  "disable_tags" BOOLEAN NOT NULL DEFAULT FALSE,
  "color_scheme" JSONB, -- figure out how to default jsonb
  "logo_url" VARCHAR,
  "banner_url" VARCHAR,
  "show_banner" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,    -- REFERENCES users(id)
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER     -- REFERENCES users(id),
);
