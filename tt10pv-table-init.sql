CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE "user" (
	id TEXT PRIMARY KEY
);

CREATE TABLE video_metadata (
	id TEXT,
	thumbnail TEXT NOT NULL,
	title TEXT NOT NULL,
	uploader TEXT NOT NULL,
	uploader_id TEXT NOT NULL,
	upload_date DATE NOT NULL,
	duration INT,
	platform TEXT NOT NULL,
	whitelisted BOOL NOT NULL DEFAULT FALSE,
	source TEXT NOT NULL DEFAULT '',
	PRIMARY KEY (id, platform)
);
CREATE INDEX trgm_idx ON video_metadata USING GIN (title gin_trgm_ops);

CREATE TABLE ballot_item (
	user_id TEXT NOT NULL,
	video_id TEXT NOT NULL,
	platform TEXT NOT NULL,
	creation_date TIMESTAMP NOT NULL,
	index INT NOT NULL,
	PRIMARY KEY (user_id, index),
	FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
	FOREIGN KEY (video_id, platform) REFERENCES video_metadata(id, platform) ON DELETE CASCADE
);

CREATE TABLE playlist (
	id TEXT PRIMARY KEY,
	owner_id TEXT,
	thumbnail TEXT,
	name TEXT,
	description TEXT,
	last_accessed DATE
);

CREATE TABLE playlist_item (
	id SERIAL PRIMARY KEY,
	playlist_id TEXT NOT NULL,
	video_id TEXT NOT NULL,
	platform TEXT NOT NULL,
	FOREIGN KEY (playlist_id) REFERENCES playlist(id) ON DELETE CASCADE,
	FOREIGN KEY (video_id, platform) REFERENCES video_metadata(id, platform) ON DELETE CASCADE
);

CREATE TABLE label_config (
	name TEXT NOT NULL,
	type TEXT NOT NULL,
	details TEXT NOT NULL,
	trigger TEXT PRIMARY KEY
);

CREATE TABLE manual_label (
	video_id TEXT,
	platform TEXT,
	label TEXT NOT NULL,
	content TEXT NOT NULL,
	PRIMARY KEY (video_id, platform),
	FOREIGN KEY (video_id, platform) REFERENCES video_metadata(id, platform) ON DELETE CASCADE
);

-- Changes from previous version
UPDATE ballot_item
SET creation_date = '2000-01-01'
WHERE creation_date IS NULL;

ALTER TABLE ballot_item ALTER COLUMN creation_date SET NOT NULL;

INSERT INTO label_config (name, type, details, trigger) VALUES (
	'2a',
	'maybe ineligible',
	'Vote for last month''s videos based on your own time zone',
	'Video may be too old or new'
);
-- also clear .next/cache and .next/dev/cache
