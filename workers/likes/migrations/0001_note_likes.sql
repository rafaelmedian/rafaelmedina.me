CREATE TABLE IF NOT EXISTS note_likes (
  note_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (note_id, visitor_id)
) WITHOUT ROWID;
