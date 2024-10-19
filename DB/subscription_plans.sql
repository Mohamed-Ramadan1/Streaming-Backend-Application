-- File: subscription_plans.sql
CREATE TABLE subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration INTERVAL NOT NULL,
    features TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on name for faster lookups
CREATE INDEX idx_subscription_plans_name ON subscription_plans(name);

-- Create trigger for updating the updated_at timestamp
CREATE TRIGGER update_subscription_plans_modtime
BEFORE UPDATE ON subscription_plans
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Insert some sample data
INSERT INTO subscription_plans (name, price, duration, features) VALUES
('Basic', 9.99, '1 month', ARRAY['SD streaming', '1 screen at a time']),
('Standard', 13.99, '1 month', ARRAY['HD streaming', '2 screens at a time', 'Downloads']),
('Premium', 17.99, '1 month', ARRAY['UHD streaming', '4 screens at a time', 'Downloads', 'Offline viewing']);