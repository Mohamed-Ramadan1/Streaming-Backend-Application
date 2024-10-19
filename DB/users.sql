-- Enum types
CREATE TYPE subscriptionType AS ENUM ('free', 'basic', 'premium');
CREATE TYPE accountType AS ENUM ('personal', 'business', 'admin');
CREATE TYPE genderType AS ENUM ('male', 'female', 'non_binary');
CREATE TYPE languagePreference AS ENUM ('english', 'spanish', 'french', 'german', 'mandarin', 'japanese', 'korean', 'other');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    passwordSalt VARCHAR(255),
    passwordResetToken VARCHAR(255),
    passwordResetExpires TIMESTAMPTZ,
    phoneNumber VARCHAR(20) UNIQUE,
    dateOfBirth DATE,
    age INTEGER GENERATED ALWAYS AS (DATE_PART('year', AGE(dateOfBirth))) STORED,
    gender genderType,
    profileImage VARCHAR(255),
    profileImagePublicId VARCHAR(255),
    roles JSONB DEFAULT '["user"]'::jsonb,
    isEmailVerified BOOLEAN DEFAULT FALSE,
    emailVerificationToken VARCHAR(255),
    emailVerificationTokenExpiresAt TIMESTAMPTZ,
    isAccountActive BOOLEAN DEFAULT TRUE,
    isNotificationMuted BOOLEAN DEFAULT FALSE,
    lastLoginAt TIMESTAMPTZ,
    preferredLanguage languagePreference DEFAULT 'english',
    favoriteGenres TEXT[],
    accountType accountType DEFAULT 'personal',
    metadata JSONB,
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMPTZ
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phoneNumber);
CREATE INDEX idx_users_name ON users(lastName, firstName);
CREATE INDEX idx_users_dob ON users(dateOfBirth);
CREATE INDEX idx_users_account_status ON users(isAccountActive, isEmailVerified);
CREATE INDEX idx_users_last_login ON users(lastLoginAt);

-- Trigger for updating 'updatedAt' in users table
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();