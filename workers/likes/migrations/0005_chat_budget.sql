-- A single shared row bounds paid inference across all visitor identities.
-- UTC day/month rollover happens atomically when reserving the next call.
CREATE TABLE IF NOT EXISTS profile_chat_budget (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  day TEXT NOT NULL,
  month TEXT NOT NULL,
  daily_calls INTEGER NOT NULL,
  monthly_calls INTEGER NOT NULL
);
