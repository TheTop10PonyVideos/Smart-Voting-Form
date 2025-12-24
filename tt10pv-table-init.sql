-- In database 'postgres'
-- Reference: https://github.com/citusdata/pg_cron/blob/main/README.md
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule_in_database(
	'update_recent_status',
	'0 0 8 * *',
    $$
	UPDATE video_metadata
	SET	recent = upload_date >= date_trunc('month', CURRENT_DATE) - interval '1 month' - interval '1 day'
	WHERE upload_date >= date_trunc('month', CURRENT_DATE) - interval '4 month';
	$$,
    'smols_form'
);


-- In form database
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS "user" (
	id TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS video_metadata (
	id TEXT,
	thumbnail TEXT NOT NULL,
	title TEXT NOT NULL,
	uploader TEXT NOT NULL,
	uploader_id TEXT NOT NULL,
	upload_date DATE NOT NULL,
	duration INT,
	platform TEXT NOT NULL,
	recent BOOL NOT NULL,
	whitelisted BOOL NOT NULL DEFAULT FALSE,
	source TEXT NOT NULL DEFAULT '',
	PRIMARY KEY (id, platform)
);

CREATE INDEX IF NOT EXISTS trgm_idx ON video_metadata
USING GIN (title gin_trgm_ops)
WHERE recent AND whitelisted;

CREATE TABLE IF NOT EXISTS ballot_item (
	user_id TEXT NOT NULL,
	video_id TEXT NOT NULL,
	platform TEXT NOT NULL,
	creation_date TIMESTAMP NOT NULL,
	index INT NOT NULL,
	PRIMARY KEY (user_id, index),
	FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
	FOREIGN KEY (video_id, platform) REFERENCES video_metadata(id, platform) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS playlist (
	id TEXT PRIMARY KEY,
	owner_id TEXT,
	thumbnail TEXT,
	name TEXT,
	description TEXT,
	last_accessed DATE
);

CREATE TABLE IF NOT EXISTS playlist_item (
	id SERIAL PRIMARY KEY,
	playlist_id TEXT NOT NULL,
	video_id TEXT NOT NULL,
	platform TEXT NOT NULL,
	FOREIGN KEY (playlist_id) REFERENCES playlist(id) ON DELETE CASCADE,
	FOREIGN KEY (video_id, platform) REFERENCES video_metadata(id, platform) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS label_config (
	name TEXT NOT NULL,
	type TEXT NOT NULL,
	details TEXT NOT NULL,
	trigger TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS manual_label (
	video_id TEXT,
	platform TEXT,
	label TEXT NOT NULL,
	content TEXT NOT NULL,
	PRIMARY KEY (video_id, platform),
	FOREIGN KEY (video_id, platform) REFERENCES video_metadata(id, platform) ON DELETE CASCADE
);

-- Changes from previous version
ALTER TABLE video_metadata ADD COLUMN recent BOOL NOT NULL DEFAULT FALSE;
ALTER TABLE video_metadata ALTER COLUMN recent DROP DEFAULT;

DROP INDEX trgm_idx;
CREATE INDEX trgm_idx ON video_metadata
USING GIN (title gin_trgm_ops)
WHERE recent AND whitelisted;
