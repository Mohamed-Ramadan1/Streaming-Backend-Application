-- File: payment_history.sql
CREATE TABLE payment_history (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    subscription_plan_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    paid_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id)
);

CREATE INDEX idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX idx_payment_history_subscription_plan_id ON payment_history(subscription_plan_id);
CREATE INDEX idx_payment_history_payment_status ON payment_history(payment_status);