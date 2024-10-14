
-- User addresses table
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL REFERENCES users(id),
    addressType VARCHAR(50) NOT NULL CHECK (addressType IN ('home', 'work', 'billing', 'shipping')),
    streetAddress VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postalCode VARCHAR(20),
    country VARCHAR(50) NOT NULL,
    isPrimary BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for user_addresses table
CREATE INDEX idx_address_user ON user_addresses(userId);
CREATE INDEX idx_address_type ON user_addresses(addressType);
CREATE INDEX idx_address_country ON user_addresses(country);

-- Trigger for updating 'updatedAt' in user_addresses table
CREATE TRIGGER set_timestamp_addresses
BEFORE UPDATE ON user_addresses
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Ensure only one primary address per user and address type
CREATE UNIQUE INDEX idx_primary_address ON user_addresses (userId, addressType) WHERE isPrimary = TRUE;

-- Function to ensure only one primary address per user and address type
CREATE OR REPLACE FUNCTION ensure_single_primary_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.isPrimary THEN
        UPDATE user_addresses
        SET isPrimary = FALSE
        WHERE userId = NEW.userId
          AND addressType = NEW.addressType
          AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain single primary address
CREATE TRIGGER trig_single_primary_address
BEFORE INSERT OR UPDATE ON user_addresses
FOR EACH ROW
EXECUTE FUNCTION ensure_single_primary_address();