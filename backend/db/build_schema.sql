--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--==--
--==--==--==--==--==--     Drop Tables     --==--==--==--==--==--
--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--==--

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS passwords CASCADE;
DROP TABLE IF EXISTS blog CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS player_stats CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;
DROP TABLE IF EXISTS divisions CASCADE;
DROP TABLE IF EXISTS team_season_division CASCADE;
DROP TABLE IF EXISTS game_season_division CASCADE;
DROP TABLE IF EXISTS referees CASCADE;
DROP TABLE IF EXISTS referees_games CASCADE;
DROP TABLE IF EXISTS players_teams CASCADE;
DROP TABLE IF EXISTS suspensions CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS goalie_stats CASCADE;


--==--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--
--==--==--==--==--==--    Create Tables    --==--==--==--==--==--
--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--==--

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR,
  "last_name" VARCHAR,
  "email" VARCHAR,
  "admin_type" VARCHAR,
  "is_suspended" BOOLEAN NOT NULL DEFAULT false,
  "suspended_date" TIMESTAMP,
  "invite_token" VARCHAR,
  "invite_date" TIMESTAMP,
  "reinvite_date" TIMESTAMP,
  "last_login" TIMESTAMP,
  "created_date" TIMESTAMP,
  "created_by" INTEGER      -- REFERENCES users(id)
);

CREATE TABLE "passwords" (
  "id" SERIAL PRIMARY KEY, 
  "user_id" INTEGER,        -- REFERENCES users(id),
  "salt" VARCHAR,
  "pw" VARCHAR
);

CREATE TABLE "roles" (
  "id" SERIAL PRIMARY KEY, 
  "name" VARCHAR,
  "description" VARCHAR
);

CREATE TABLE "user_role" (
  "id" SERIAL PRIMARY KEY, 
  "user_id" INTEGER NOT NULL,
  "role_id" INTEGER NOT NULL
);

CREATE TABLE "news" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR,
  "allow_collapse" BOOLEAN NOT NULL DEFAULT false,
  "body" VARCHAR,
  "display_order" INTEGER,
  "created_date" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
  "hidden_date" TIMESTAMP,
  "hidden_by" INTEGER,         -- REFERENCES users(id),
);

CREATE TABLE "tags" (
  "id" SERIAL PRIMARY KEY, 
  "name" VARCHAR
);

CREATE TABLE "news_tags" (
  "id" SERIAL PRIMARY KEY,
  "tag_id" INTEGER,           -- REFERENCES tags(id)
  "news_id" INTEGER           -- REFERENCES news(id)
);

CREATE TABLE "players" (
  "id"  SERIAL PRIMARY KEY,
  "first_name" VARCHAR(255),
  "last_name" VARCHAR(255),
  "email" VARCHAR(255),
  "registered_date" TIMESTAMP,
  "created_date" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "player_stats" (
  "id" SERIAL PRIMARY KEY,
  "player_id" INTEGER,         -- REFERENCES players(id)
  "team_id" INTEGER,           -- REFERENCES teams(id)
  "season_id" varchar,         -- REFERENCES seasons(id)
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
  "created_date" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER,        -- REFERENCES users(id),
  "hidden_date" TIMESTAMP,
  "hidden_by" INTEGER,         -- REFERENCES users(id),
  "is_active" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "divisions" (
  "id"  SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "season_id" INTEGER,         -- REFERENCES seasons(id)
  "created_date" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER,        -- REFERENCES users(id),
  "hidden_date" TIMESTAMP,
  "hidden_by" INTEGER          -- REFERENCES users(id),
);

CREATE TABLE "teams" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "colors" JSONB,
  "created_date" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "my_random_table" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  "colors" JSONB,
  "score" INTEGER NOT NULL DEFAULT 0,
  "association" VARCHAR NOT NULL DEFAULT 'USA Hockey',
);

CREATE TABLE "team_season_division" (
  "id" SERIAL PRIMARY KEY,
  "team_id" INTEGER,           -- REFERENCES teams(id)
  "season_id" INTEGER,         -- REFERENCES seasons(id)
  "division_id" INTEGER,       -- REFERENCES divisions(id)
  "games_played" INTEGER NOT NULL DEFAULT 0,
  "wins" INTEGER NOT NULL DEFAULT 0,
  "losses" INTEGER NOT NULL DEFAULT 0,
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


CREATE TABLE "players_teams" (
  "id" SERIAL PRIMARY KEY,
  "player_id" INTEGER,        -- REFERENCES players(id)
  "team_id" INTEGER,          -- REFERENCES teams(id)
  "season_id" INTEGER         -- REFERENCES seasons(id)
);

CREATE TABLE "locations" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "address" VARCHAR,
  "created_date" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "games" (
  "id" SERIAL PRIMARY KEY,
  "has_been_played" BOOLEAN,
  "home_team" INTEGER,           -- REFERENCES teams(id)
  "away_team" INTEGER,           -- REFERENCES teams(id)
  "location_id" INTEGER,         -- REFERENCES locations(id)
  "scorekeeper_id" INTEGER,      -- REFERENCES users(id)
  -- POSSIBLY NEEDS SEASON_ID
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
  "game_notes" VARCHAR
);


--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--
--==--==--==--==--==--     Add Foreign Keys     --==--==--==--==--==--
--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

ALTER TABLE "users" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "passwords" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "news" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "news" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "news" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");
ALTER TABLE "news" ADD FOREIGN KEY ("hidden_by") REFERENCES "users" ("id");

ALTER TABLE "players" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "players" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "players" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");

ALTER TABLE "player_stats" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");
ALTER TABLE "player_stats" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");
ALTER TABLE "player_stats" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");

ALTER TABLE "seasons" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "seasons" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "seasons" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");
ALTER TABLE "seasons" ADD FOREIGN KEY ("hidden_by") REFERENCES "users" ("id");

ALTER TABLE "divisions" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");
ALTER TABLE "divisions" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "divisions" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "divisions" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");
ALTER TABLE "divisions" ADD FOREIGN KEY ("hidden_by") REFERENCES "users" ("id");

ALTER TABLE "teams" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "teams" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "teams" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");

ALTER TABLE "team_season_division" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");
ALTER TABLE "team_season_division" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");
ALTER TABLE "team_season_division" ADD FOREIGN KEY ("division_id") REFERENCES "divisions" ("id");

ALTER TABLE "game_season_division" ADD FOREIGN KEY ("game_id") REFERENCES "games" ("id");
ALTER TABLE "game_season_division" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");
ALTER TABLE "game_season_division" ADD FOREIGN KEY ("division_id") REFERENCES "divisions" ("id");

ALTER TABLE "players_teams" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");
ALTER TABLE "players_teams" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");
ALTER TABLE "players_teams" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");

ALTER TABLE "locations" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "locations" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "locations" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");

ALTER TABLE "games" ADD FOREIGN KEY ("home_team") REFERENCES "teams" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("away_team") REFERENCES "teams" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("location_id") REFERENCES "locations" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("scorekeeper_id") REFERENCES "users" ("id");

ALTER TABLE "news_tags" ADD FOREIGN KEY ("tags_id") REFERENCES "tags" ("id");
ALTER TABLE "news_tags" ADD FOREIGN KEY ("news_id") REFERENCES "news" ("id");

ALTER TABLE "user_role" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "user_role" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

-- CREATE TABLE "goalie_stats" (
--   "id" int,
--   "player_id" int,
--   "team_id" int,
--   "season" varchar,
--   "games_played" int,
--   "wins" int,
--   "losses" int,
--   "ties" int,
--   "over_time_losses" int,
--   "shots_allowed" int,
--   "goals_allowed" int,
--   "goals_allowed_average" int,
--   "saves" int,
--   "saves_percentage" int,
--   "shut_outs" int,
--   "empty_net_goals_against" int,
--   "time_on_ice" int
-- );

-- CREATE TABLE "referees" (
--   "id" int,
--   "first_name" varchar,
--   "last_name" varchar,
--   "email" varchar,
--   "certification" varchar
-- );

-- CREATE TABLE "referees_games" (
--   "id" int,
--   "referee_id" int,
--   "game_id" int
-- );

-- CREATE TABLE "suspensions" (
--   "id" int,
--   "player_id" int,
--   "first_name" varchar,
--   "last_name" varchar,
--   "game_date" varchar,
--   "message" varchar,
--   "posted_by" int,
--   "posted_date" datetime
-- );