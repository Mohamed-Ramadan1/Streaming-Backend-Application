CREATE TABLE content_feedback (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content_id BIGINT NOT NULL,
    content_type VARCHAR(10) NOT NULL,
    rating DECIMAL(3,1) NOT NULL,
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    UNIQUE (user_id, content_id)
);

CREATE INDEX idx_content_feedback_user_id ON content_feedback(user_id);
CREATE INDEX idx_content_feedback_content_id ON content_feedback(content_id);
CREATE INDEX idx_content_feedback_rating ON content_feedback(rating);

CREATE TRIGGER update_content_feedback_modtime
BEFORE UPDATE ON content_feedback
FOR EACH ROW EXECUTE FUNCTION update_modified_column();