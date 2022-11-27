-- Created: October 8th, 2022 @ 4:54:59 AM 
-- Write SQL for new migration

ALTER TABLE "players"
ADD parent_id INTEGER; -- REFERENCES users(id),

ALTER TABLE "players" ADD FOREIGN KEY ("parent_id") REFERENCES "users" ("id");
