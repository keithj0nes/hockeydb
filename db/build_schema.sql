--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--==--
--==--==--==--==--==--     Drop Tables     --==--==--==--==--==--
--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--==--

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS passwords CASCADE;
DROP TABLE IF EXISTS blog CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS player_stats CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;
DROP TABLE IF EXISTS divisions CASCADE;
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
  "is_suspended" BOOLEAN,
  "suspended_date" TIMESTAMP,
  "is_admin" BOOLEAN,
  "invite_token" VARCHAR,
  "invite_date" TIMESTAMP,
  "reinvite_date" TIMESTAMP
);

CREATE TABLE "passwords" (
  "id" SERIAL PRIMARY KEY, 
  "user_id" INTEGER,        -- REFERENCES users(id),
  "salt" VARCHAR,
  "pw" VARCHAR
);

CREATE TABLE "blog" (
  "id" SERIAL PRIMARY KEY,
  "message" VARCHAR,
  "created_date" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
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
  "season" varchar,
  "games_played" INTEGER,
  "goals" INTEGER,
  "assists" INTEGER,
  "points" INTEGER,
  "penalties_in_minutes" INTEGER,
  "game_winning_goals" INTEGER,
  "power_play_goals" INTEGER,
  "short_handed_goals" INTEGER,
  "goals_per_game" INTEGER,
  "assists_per_game" INTEGER,
  "points_per_game" INTEGER
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
  "hidden_by" INTEGER,        -- REFERENCES users(id),
  "is_active" BOOLEAN
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
  "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "teams" (
  "id" SERIAL PRIMARY KEY,
  "division_id" INTEGER,
  "name" VARCHAR,
  "colors" VARCHAR,
  "created_date" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
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
  "home_score" INTEGER,
  "home_first_score" INTEGER,
  "home_second_score" INTEGER,
  "home_third_score" INTEGER,
  "home_first_sog" INTEGER,
  "home_second_sog" INTEGER,
  "home_third_sog" INTEGER,
  "home_first_pim" INTEGER,
  "home_second_pim" INTEGER,
  "home_third_pim" INTEGER,
  "away_score" INTEGER,
  "away_first_score" INTEGER,
  "away_second_score" INTEGER,
  "away_third_score" INTEGER,
  "away_first_sog" INTEGER,
  "away_second_sog" INTEGER,
  "away_third_sog" INTEGER,
  "away_first_pim" INTEGER,
  "away_second_pim" INTEGER,
  "away_third_pim" INTEGER,
  "game_notes" VARCHAR
);


--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--
--==--==--==--==--==--     Add Foreign Keys     --==--==--==--==--==--
--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

ALTER TABLE "passwords" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "blog" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "blog" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "blog" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");

ALTER TABLE "players" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "players" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "players" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");

ALTER TABLE "player_stats" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");
ALTER TABLE "player_stats" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

ALTER TABLE "seasons" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "seasons" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "seasons" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");
ALTER TABLE "seasons" ADD FOREIGN KEY ("hidden_by") REFERENCES "users" ("id");

ALTER TABLE "divisions" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");
ALTER TABLE "divisions" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "divisions" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "divisions" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");

ALTER TABLE "teams" ADD FOREIGN KEY ("division_id") REFERENCES "divisions" ("id");
ALTER TABLE "teams" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "teams" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "teams" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");

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