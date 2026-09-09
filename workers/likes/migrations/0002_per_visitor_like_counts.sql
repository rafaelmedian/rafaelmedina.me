-- Likes moved from one-per-visitor to a per-visitor tally: every tap counts
-- until the Worker's cap. Existing rows were single likes, so they seed at 1.
ALTER TABLE note_likes ADD COLUMN count INTEGER NOT NULL DEFAULT 1;
