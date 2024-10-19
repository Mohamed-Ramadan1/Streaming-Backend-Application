-- File: content.sql
CREATE TABLE Content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_date DATE,
    genres TEXT[],
    language VARCHAR(50),
    subtitle_languages TEXT[],
    audio_languages TEXT[],
    country_of_origin VARCHAR(100),
    keywords TEXT[],
    plot_summary TEXT,
    rating VARCHAR(10),
    imdb_rating DECIMAL(3,1),
    writers TEXT[],
    budget DECIMAL(15,2),
    cast TEXT[],
    director VARCHAR(255),
    poster_url VARCHAR(255),
    trailer_url VARCHAR(255),
    production_company VARCHAR(255),
    awards TEXT[],
    tagline TEXT,
    likes_count INTEGER DEFAULT 0,
    user_comments TEXT[],
    user_ratings DECIMAL(3,2)[],
    views_count INTEGER DEFAULT 0,
    license_start_date DATE,
    license_end_date DATE,
    licensor VARCHAR(255),
    age_restriction VARCHAR(10),
    content_warning TEXT,
    available_resolutions TEXT[],
    available_in_regions TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER update_content_modtime
BEFORE UPDATE ON Content
FOR EACH ROW EXECUTE FUNCTION update_modified_column();