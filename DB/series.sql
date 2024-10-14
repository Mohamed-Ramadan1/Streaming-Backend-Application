-- File: series.sql
CREATE TABLE Series (
    seasons_count INTEGER,
    total_episodes INTEGER,
    total_box_office_revenue DECIMAL(15,2)
) INHERITS (Content);

CREATE TRIGGER update_series_modtime
BEFORE UPDATE ON Series
FOR EACH ROW EXECUTE FUNCTION update_modified_column();