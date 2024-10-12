-- id => serial PRIMERY KEY  NOT NULL
-- firstName=>
-- lastName=>
-- password=>
-- passwordResetToken=>
-- passwordResetExpires=>
-- email=>
-- roles=>
-- phoneNumber=>
-- address=>
-- age=>
-- profileImage=>
-- profileImagePublicId=>
-- dataOfBerth=>
-- country=>
-- subscriptionPlan=>
-- isEmailVerified=>
-- emailVerificationToken=>
-- emailVerificationTokenExpiresAt=>
-- isSubscriptionActive=>
-- isAccountActive=>
-- isNotificationMuted=>
-- createdAt=> time stamp with time zone
-- updatedAt=> time stamp  with time zone

-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY NOT NULL,
--     firstName VARCHAR(50) NOT NULL,
--     lastName VARCHAR(50) NOT NULL,
--     password VARCHAR(255) NOT NULL, -- To store hashed passwords
--     passwordSalt VARCHAR(255), -- Optional: for password hashing
--     passwordResetToken VARCHAR(255),
--     passwordResetExpires TIMESTAMPTZ,
--     email VARCHAR(255) NOT NULL UNIQUE,
--     roles TEXT[] DEFAULT ARRAY['user'], -- Or use ENUM based roles
--     phoneNumber VARCHAR(20) UNIQUE,
--     address VARCHAR(255),
--     age INTEGER,
--     profileImage VARCHAR(255),
--     profileImagePublicId VARCHAR(255),
--     dateOfBirth DATE,
--     country VARCHAR(50),
--     subscriptionPlan subscriptionType DEFAULT 'free', -- Use ENUM for subscription plans
--     isEmailVerified BOOLEAN DEFAULT FALSE,
--     emailVerificationToken VARCHAR(255),
--     emailVerificationTokenExpiresAt TIMESTAMPTZ,
--     isSubscriptionActive BOOLEAN DEFAULT FALSE,
--     isAccountActive BOOLEAN DEFAULT FALSE,
--     isNotificationMuted BOOLEAN DEFAULT FALSE,
--     metadata JSONB, -- For storing additional data
--     createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     deletedAt TIMESTAMPTZ -- Soft delete feature
-- );

-- CREATE INDEX idx_email ON users(email);
-- CREATE INDEX idx_isEmailVerified ON users(isEmailVerified);
-- CREATE INDEX idx_isAccountActive ON users(isAccountActive);


-- CREATE TYPE subscriptionType AS ENUM ('free', 'basic', 'premium');


-- Improved SQL Table Structure for 'users'

CREATE TYPE subscriptionType AS ENUM ('free', 'basic', 'premium');
CREATE TYPE accountType AS ENUM ('personal', 'business', 'admin');
CREATE TYPE genderType AS ENUM ('male', 'female', 'non_binary');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstName VARCHAR(100) NOT NULL, 
    lastName VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL, -- To store hashed passwords
    passwordSalt VARCHAR(255), -- Optional: for password hashing
    passwordResetToken VARCHAR(255),
    passwordResetExpires TIMESTAMPTZ,
    email VARCHAR(255) NOT NULL UNIQUE, -- Consider encrypting sensitive fields
    roles jsonb DEFAULT '["user"]', -- Flexible roles using JSONB
    phoneNumber VARCHAR(20) UNIQUE CHECK (phoneNumber ~ '^\+[1-9]\d{1,14}$'), -- Standardized phone number format
    streetAddress VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postalCode VARCHAR(20),
    country VARCHAR(50),
    age INTEGER,
    gender genderType,
    profileImage VARCHAR(255),
    profileImagePublicId VARCHAR(255),
    dateOfBirth DATE,
    subscriptionPlan subscriptionType DEFAULT 'free', -- ENUM for subscription plans
    isEmailVerified BOOLEAN DEFAULT FALSE,
    emailVerificationToken VARCHAR(255),
    emailVerificationTokenExpiresAt TIMESTAMPTZ,
    isSubscriptionActive BOOLEAN DEFAULT FALSE,
    isAccountActive BOOLEAN DEFAULT FALSE,
    isNotificationMuted BOOLEAN DEFAULT FALSE,
    metadata JSONB, -- For storing additional data
    accountType accountType DEFAULT 'personal', -- Account type ENUM
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMPTZ -- Soft delete feature
);

-- Indexes for improved search performance
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_isEmailVerified ON users(isEmailVerified);
CREATE INDEX idx_isAccountActive ON users(isAccountActive);
CREATE INDEX idx_phoneNumber ON users(phoneNumber);
CREATE INDEX idx_dateOfBirth ON users(dateOfBirth);
CREATE INDEX idx_country ON users(country);

-- Trigger to automatically update `updatedAt` on row updates
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$i am r4o
BEGIN
   NEW.updatedAt = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
