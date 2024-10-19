
-- Subscription history table
CREATE TABLE subscription_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL REFERENCES users(id),
    planType subscriptionType NOT NULL,
    startDate TIMESTAMPTZ NOT NULL,
    endDate TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
    paymentMethod VARCHAR(50),
    amount DECIMAL(10, 2),
    currency VARCHAR(3),
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for subscription_history table
CREATE INDEX idx_subscription_user ON subscription_history(userId);
CREATE INDEX idx_subscription_dates ON subscription_history(startDate, endDate);
CREATE INDEX idx_subscription_status ON subscription_history(status);

-- Trigger for updating 'updatedAt' in subscription_history table
CREATE TRIGGER set_timestamp_subscriptions
BEFORE UPDATE ON subscription_history
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
