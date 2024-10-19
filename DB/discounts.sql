-- File: discounts.sql
CREATE TABLE discounts (
    discount_id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_percentage DECIMAL(5,2),
    discount_amount DECIMAL(10,2),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL
);

CREATE INDEX idx_discounts_code ON discounts(code);
CREATE INDEX idx_discounts_start_date ON discounts(start_date);
CREATE INDEX idx_discounts_end_date ON discounts(end_date);

-- Ensure that either discount_percentage or discount_amount is set, but not both
ALTER TABLE discounts ADD CONSTRAINT check_discount_type 
CHECK ((discount_percentage IS NULL) != (discount_amount IS NULL));