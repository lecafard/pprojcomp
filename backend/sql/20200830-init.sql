-- initial schema, might just use SQLAlchemy

CREATE TABLE meeting (
    id SERIAL PRIMARY KEY,
    owner_key VARCHAR(32) NOT NULL UNIQUE,
    guest_key VARCHAR(32) NOT NULL UNIQUE,
    name    VARCHAR(64) NOT NULL,
    location VARCHAR(64) NOT NULL,
    description TEXT,
    options JSON NOT NULL
);

CREATE TABLE entry (
    meeting_id INTEGER NOT NULL REFERENCES meeting(id),
    name VARCHAR(32) NOT NULL,
    UNIQUE(meeting_id, name),
    password VARCHAR(64),
    schedule JSON,
    notes TEXT
);