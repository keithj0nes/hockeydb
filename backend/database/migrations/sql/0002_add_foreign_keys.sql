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

ALTER TABLE "player_team_season" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");
ALTER TABLE "player_team_season" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");
ALTER TABLE "player_team_season" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");

ALTER TABLE "locations" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "locations" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "locations" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");

ALTER TABLE "games" ADD FOREIGN KEY ("home_team") REFERENCES "teams" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("away_team") REFERENCES "teams" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("location_id") REFERENCES "locations" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("scorekeeper_id") REFERENCES "users" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");

ALTER TABLE "news_tags" ADD FOREIGN KEY ("tag_id") REFERENCES "tags" ("id");
ALTER TABLE "news_tags" ADD FOREIGN KEY ("news_id") REFERENCES "news" ("id");

ALTER TABLE "user_role" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "user_role" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

-- ALTER TABLE "registrations" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
-- ALTER TABLE "registrations" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");
-- ALTER TABLE "registrations" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
-- ALTER TABLE "registrations" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
-- ALTER TABLE "registrations" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");
-- ALTER TABLE "registrations" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");

ALTER TABLE "settings" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "settings" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
