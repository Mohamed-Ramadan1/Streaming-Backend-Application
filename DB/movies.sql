-- File: movies.sql
CREATE TABLE Movies (
    duration INTERVAL,
    release_type VARCHAR(50),
    box_office_revenue DECIMAL(15,2)
) INHERITS (Content);

CREATE TRIGGER update_movies_modtime
BEFORE UPDATE ON Movies
FOR EACH ROW EXECUTE FUNCTION update_modified_column();