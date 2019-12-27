DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS passwords CASCADE;
DROP TABLE IF EXISTS blog CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS player_stats CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;
DROP TABLE IF EXISTS divisions CASCADE;


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
  "user_id" INTEGER REFERENCES users(id),
  "salt" VARCHAR,
  "pw" VARCHAR
);


CREATE TABLE "blog" (
  "id" SERIAL PRIMARY KEY,
  "message" VARCHAR,
  "created_date" TIMESTAMP,
  "created_by" INTEGER REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER REFERENCES users(id)
);
-- INSERT INTO blog (message, created_date, created_by, updated_date, updated_by, deleted_date, deleted_by)
-- VALUES ('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sodales metus et dolor convallis, auctor vulputate lectus imperdiet. Donec tempor porta metus, sit amet dictum nisi pretium id. Nulla vitae massa efficitur, malesuada velit eget, aliquam odio. Vestibulum nunc ex, ullamcorper a luctus vitae, rhoncus eget turpis. Duis rhoncus lobortis dignissim. In sollicitudin vel turpis at lobortis. Aenean eget pretium mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum sit amet sapien nec diam commodo dignissim eu at dui.', 
-- null, null, null, null, null, null);

CREATE TABLE "players" (
  "id"  SERIAL PRIMARY KEY,
  "first_name" VARCHAR(255),
  "last_name" VARCHAR(255),
  "email" VARCHAR(255),
  "registered_date" TIMESTAMP,
  "created_date" TIMESTAMP,
  "created_by" INTEGER REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER REFERENCES users(id)
);

CREATE TABLE "player_stats" (
  "id" SERIAL PRIMARY KEY,
  "player_id" INTEGER REFERENCES players(id),
  "team_id" INTEGER,
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

CREATE TABLE "players_teams" (
  "id" SERIAL PRIMARY KEY,
  "player_id" INTEGER REFERENCES players(id),
  "team_id" INTEGER REFERENCES teams(id),
  "season" INTEGER REFERENCES seasons(id),
);

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




CREATE TABLE "teams" (
  "id" SERIAL PRIMARY KEY,
  "division_id" INTEGER REFERENCES divisions(id),
  "name" VARCHAR,
  "colors" VARCHAR,
  "created_date" TIMESTAMP,
  "created_by" INTEGER REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER REFERENCES users(id)
);


CREATE TABLE "seasons" (
  "id"  SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "type" VARCHAR,
  "created_date" TIMESTAMP,
  "created_by" INTEGER REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER REFERENCES users(id),
  "is_active" BOOLEAN
);


CREATE TABLE "divisions" (
  "id"  SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "season_id" INTEGER REFERENCES seasons(id)
  "created_date" TIMESTAMP,
  "created_by" INTEGER REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER REFERENCES users(id)
);


CREATE TABLE "locations" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "address" VARCHAR,
  "created_date" TIMESTAMP,
  "created_by" INTEGER REFERENCES users(id),
  "updated_date" TIMESTAMP,
  "updated_by" INTEGER REFERENCES users(id),
  "deleted_date" TIMESTAMP,
  "deleted_by" INTEGER REFERENCES users(id)
);


CREATE TABLE "games" (
  "id" SERIAL PRIMARY KEY,
  "has_been_played" BOOLEAN,
  "home_team" INTEGER REFERENCES teams(id),
  "away_team" INTEGER REFERENCES teams(id),
  "location_id" INTEGER REFERENCES locations(id),
  "scorekeeper" INTEGER REFERENCES users(id),
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



INSERT INTO users (first_name, last_name, email, is_suspended, suspended_date, is_admin)
VALUES ('test', 'user', 'test@test.com', false, null, true);

INSERT INTO passwords (user_id, salt, pw)
VALUES ('1', null, '123');

-- CURL COMMAND TO INSERT USER!!!
-- curl --header "Content-Type: application/json" \
--   --request POST \
--   --data '{"first_name": "test", "last_name": "testagain", "is_admin": true, "password_confirmation": "test", "password": "test", "email": "test@test.test"}' \
--   http://localhost:8010/api/auth/signup

INSERT INTO players (first_name, last_name, email) 
VALUES ('yo' ,'mang', 'yomang@gmail.com');

INSERT INTO player_stats (player_id, team_id, season, games_played, goals, assists, points, penalties_in_minutes, game_winning_goals, power_play_goals, short_handed_goals, goals_per_game, assists_per_game, points_per_game) 
VALUES (1, 2, 'season 1', 10, 24, 12, 36, 20, 2, 3, 0, 0, 2, 2);

INSERT INTO teams (team_name, team_division, team_colors, next_game, previous_game)
VALUES ('thunderbirds', 'western', 'navy blue/green/white', 2,1);




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
