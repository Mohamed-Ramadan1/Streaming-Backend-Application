-- File: episodes.sql
CREATE TABLE Episodes (
    id SERIAL PRIMARY KEY,
    series_id INTEGER REFERENCES Series(id),
    season_id INTEGER, -- Assuming you'll create a Seasons table later
    episode_number INTEGER,
    title VARCHAR(255),
    release_date DATE,
    duration INTERVAL,
    plot_summary TEXT,
    poster_url VARCHAR(255),
    trailer_url VARCHAR(255),
    views_count INTEGER DEFAULT 0,
    imdb_rating DECIMAL(3,1),
    license_start_date DATE,
    license_end_date DATE,
    available_resolutions TEXT[],
    available_in_regions TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_episodes_modtime
BEFORE UPDATE ON Episodes
FOR EACH ROW EXECUTE FUNCTION update_modified_column();