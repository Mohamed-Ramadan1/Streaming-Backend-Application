-- File: watchlist.sql
CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    content_type VARCHAR(10) NOT NULL, -- 'movie' or 'series'
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    UNIQUE (user_id, content_id)
);

CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX idx_watchlist_content_id ON watchlist(content_id);

CREATE TRIGGER update_watchlist_modtime
BEFORE UPDATE ON watchlist
FOR EACH ROW EXECUTE FUNCTION update_modified_column();