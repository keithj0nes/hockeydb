-- DROP TABLE IF EXISTS (table) CASCADE;

CREATE TABLE "admins" (
  "id" serial,
  "first_name" varchar,
  "last_name" varchar,
  "email" varchar,
  "is_suspended" bool,
  "is_scorekeeper" bool
);

INSERT INTO admins (first_name, last_name, email, is_suspended)
VALUES ('test', 'ing', 'test@test.com', false)



-- CREATE TABLE "admins" (
--   "id" int,
--   "first_name" varchar,
--   "last_name" varchar,
--   "email" varchar,
--   "is_active" bool
-- );

-- CREATE TABLE "scorekeepers" (
--   "id" int,
--   "first_name" varchar,
--   "last_name" varchar,
--   "email" varchar,
--   "is_active" bool
-- );

-- CREATE TABLE "passwords" (
--   "id" int,
--   "admin_id" int,
--   "scorekeeper_id" int,
--   "salt" varchar,
--   "pw" varchar
-- );

-- CREATE TABLE "players" (
--   "id" int,
--   "first_name" varchar,
--   "last_name" varchar,
--   "email" varchar,
--   "team_id" int
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

-- CREATE TABLE "players_teams" (
--   "id" int,
--   "player_id" int,
--   "team_id" int,
--   "season" varchar
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

-- CREATE TABLE "blog" (
--   "id" int,
--   "posted_by" int,
--   "posted_date" datetime,
--   "message" varchar
-- );

-- CREATE TABLE "games" (
--   "id" int,
--   "has_been_played" bool,
--   "home_team" int,
--   "away_team" int,
--   "rink_id" int,
--   "start_date" datetime,
--   "home_score" int,
--   "home_first_score" int,
--   "home_second_score" int,
--   "home_third_score" int,
--   "home_first_sog" int,
--   "home_second_sog" int,
--   "home_third_sog" int,
--   "home_first_pim" int,
--   "home_second_pim" int,
--   "home_third_pim" int,
--   "away_score" int,
--   "away_first_score" int,
--   "away_second_score" int,
--   "away_third_score" int,
--   "away_first_sog" int,
--   "away_second_sog" int,
--   "away_third_sog" int,
--   "away_first_pim" int,
--   "away_second_pim" int,
--   "away_third_pim" int,
--   "ref_one" int,
--   "ref_two" int,
--   "ref_three" int,
--   "scorekeeper" int,
--   "game_notes" varchar
-- );

-- CREATE TABLE "teams" (
--   "id" int,
--   "team_name" varchar,
--   "team_division" varchar,
--   "team_colors" varchar,
--   "next_game" int,
--   "previous_game" int
-- );

-- CREATE TABLE "rinks" (
--   "id" int,
--   "rink_name" varchar,
--   "rink_address" varchar
-- );

-- CREATE TABLE "player_stats" (
--   "id" int,
--   "player_id" int,
--   "team_id" int,
--   "season" varchar,
--   "games_played" int,
--   "goals" int,
--   "assists" int,
--   "points" int,
--   "penalties_in_minutes" int,
--   "game_winning_goals" int,
--   "power_play_goals" int,
--   "short_handed_goals" int,
--   "goals_per_game" int,
--   "assists_per_game" int,
--   "points_per_game" int
-- );

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

-- ALTER TABLE "passwords" ADD FOREIGN KEY ("admin_id") REFERENCES "admins" ("id");

-- ALTER TABLE "passwords" ADD FOREIGN KEY ("scorekeeper_id") REFERENCES "scorekeepers" ("id");

-- ALTER TABLE "blog" ADD FOREIGN KEY ("posted_by") REFERENCES "admins" ("id");

-- ALTER TABLE "suspensions" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");

-- ALTER TABLE "games" ADD FOREIGN KEY ("rink_id") REFERENCES "rinks" ("id");

-- ALTER TABLE "games" ADD FOREIGN KEY ("home_team") REFERENCES "teams" ("id");

-- ALTER TABLE "games" ADD FOREIGN KEY ("away_team") REFERENCES "teams" ("id");

-- ALTER TABLE "players" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

-- ALTER TABLE "suspensions" ADD FOREIGN KEY ("posted_by") REFERENCES "admins" ("id");

-- ALTER TABLE "players_teams" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");

-- ALTER TABLE "players_teams" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

-- ALTER TABLE "referees_games" ADD FOREIGN KEY ("referee_id") REFERENCES "referees" ("id");

-- ALTER TABLE "referees_games" ADD FOREIGN KEY ("game_id") REFERENCES "games" ("id");

-- ALTER TABLE "player_stats" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");

-- ALTER TABLE "player_stats" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");

-- ALTER TABLE "goalie_stats" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");

-- ALTER TABLE "goalie_stats" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");
