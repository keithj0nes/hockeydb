-- Created: September 13th, 2022 @ 4:42:03 AM 
-- Write SQL for new migration

ALTER TABLE passwords
ADD updated_at TIMESTAMP;
