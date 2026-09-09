-- Projects became likeable alongside notes. They get a table of their own
-- rather than a shared one: counting an item's likes sums that item's rows, so
-- keeping the two collections apart keeps a project's read off the notes table
-- and leaves the existing note rows untouched by the change.
CREATE TABLE IF NOT EXISTS project_likes (
  project_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (project_id, visitor_id)
) WITHOUT ROWID;
