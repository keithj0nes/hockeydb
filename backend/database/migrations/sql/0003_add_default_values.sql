--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--
--==--==--==--==--==--    Default Values    --==--==--==--==--==--
--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

INSERT INTO "roles" (name, description) VALUES ('Super', 'A Super Admin is top level tier');
INSERT INTO "roles" (name, description) VALUES ('Admin', 'An Admin is responsible for managing the league, scorekeepers, team managers, and players');
INSERT INTO "roles" (name, description) VALUES ('Scorekeeper', 'A Scorekeeper is responsible for inputting scores into a game');
INSERT INTO "roles" (name, description) VALUES ('Manager', 'A Manager is responsible for managing specific teams and specific team''s players');
INSERT INTO "roles" (name, description) VALUES ('Player', 'A Player is an individual who plays in the league');

INSERT INTO "tags" (name) VALUES ('announcement');
INSERT INTO "tags" (name) VALUES ('covid');
INSERT INTO "tags" (name) VALUES ('tournament');
INSERT INTO "tags" (name) VALUES ('champions');
INSERT INTO "tags" (name) VALUES ('league leaders');
INSERT INTO "tags" (name) VALUES ('evals');
