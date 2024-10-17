/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Create enum types
  pgm.createType("subscriptionType", ["free", "basic", "premium"]);
  pgm.createType("genderType", ["male", "female", "non_binary"]);
  pgm.createType("countryType", ["USA", "Canada", "UK", "Australia", "Other"]);
  pgm.createType("ageRangeType", ["18-30", "31-45", "46-60", "61+"]);
  pgm.createType("accountType", ["personal", "business", "admin"]);
  pgm.createType("profileType", ["adult", "kid"]);
  pgm.createType("languagePreference", [
    "english",
    "spanish",
    "french",
    "german",
    "mandarin",
    "japanese",
    "korean",
    "other",
  ]);

  // Create users table
  pgm.createTable("users", {
    id: {
      type: "UUID",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    firstName: { type: "VARCHAR(100)", notNull: true },
    lastName: { type: "VARCHAR(100)", notNull: true },
    email: { type: "VARCHAR(255)", notNull: true, unique: true },
    password: { type: "VARCHAR(255)", notNull: true },
    passwordSalt: { type: "VARCHAR(255)" },
    passwordResetToken: { type: "VARCHAR(255)" },
    passwordResetExpires: { type: "TIMESTAMPTZ" },
    phoneNumber: { type: "VARCHAR(20)", unique: true },
    dateOfBirth: { type: "DATE" },
    age: {
      type: "INTEGER",
      generatedAlways: {
        expression: `DATE_PART('year', AGE(dateOfBirth))`,
        stored: true,
      },
    },
    gender: { type: `"genderType"` },
    profileImage: { type: "VARCHAR(255)" },
    profileImagePublicId: { type: "VARCHAR(255)" },
    roles: { type: "JSONB", default: pgm.func(`'["user"]'::jsonb`) },
    isEmailVerified: { type: "BOOLEAN", default: false },
    emailVerificationToken: { type: "VARCHAR(255)" },
    emailVerificationTokenExpiresAt: { type: "TIMESTAMPTZ" },
    isAccountActive: { type: "BOOLEAN", default: true },
    isNotificationMuted: { type: "BOOLEAN", default: false },
    lastLoginAt: { type: "TIMESTAMPTZ" },
    preferredLanguage: { type: `"languagePreference"`, default: "english" },
    favoriteGenres: { type: "TEXT[]" },
    accountType: { type: `"accountType"`, default: "personal" },
    metadata: { type: "JSONB" },
    createdAt: { type: "TIMESTAMPTZ", default: pgm.func("CURRENT_TIMESTAMP") },
    updatedAt: { type: "TIMESTAMPTZ", default: pgm.func("CURRENT_TIMESTAMP") },
    deletedAt: { type: "TIMESTAMPTZ" },
  });

  // Create indexes
  pgm.createIndex("users", "email", { name: "idx_users_email" });
  pgm.createIndex("users", "phoneNumber", { name: "idx_users_phone" });
  pgm.createIndex("users", ["lastName", "firstName"], {
    name: "idx_users_name",
  });
  pgm.createIndex("users", "dateOfBirth", { name: "idx_users_dob" });
  pgm.createIndex("users", ["isAccountActive", "isEmailVerified"], {
    name: "idx_users_account_status",
  });
  pgm.createIndex("users", "lastLoginAt", { name: "idx_users_last_login" });

  // Create function for updating timestamp
  pgm.createFunction(
    "trigger_set_timestamp",
    [],
    {
      returns: "trigger",
      language: "plpgsql",
      replace: true,
    },
    `
    BEGIN
      NEW."updatedAt" = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    `
  );

  // Create trigger
  pgm.createTrigger("users", "set_timestamp_users", {
    when: "BEFORE",
    operation: "UPDATE",
    level: "ROW",
    function: "trigger_set_timestamp",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Helper function to drop an index if it exists
  const dropIndexIfExists = (tableName, indexName) => {
    pgm.sql(`DROP INDEX IF EXISTS "${indexName}"`);
  };

  // Drop indexes
  dropIndexIfExists("users", "idx_users_email");
  dropIndexIfExists("users", "idx_users_phone");
  dropIndexIfExists("users", "idx_users_name");
  dropIndexIfExists("users", "idx_users_dob");
  dropIndexIfExists("users", "idx_users_account_status");
  dropIndexIfExists("users", "idx_users_last_login");

  // Drop constraints if they exist
  pgm.sql(`
    DO $$ 
    BEGIN 
      ALTER TABLE "users" DROP CONSTRAINT IF EXISTS users_email_key;
      ALTER TABLE "users" DROP CONSTRAINT IF EXISTS users_phonenumber_key;
    EXCEPTION
      WHEN undefined_table THEN
        NULL;
    END $$;
  `);

  // Drop trigger if exists
  pgm.sql(`DROP TRIGGER IF EXISTS set_timestamp_users ON users`);

  // Drop function if exists
  pgm.sql(`DROP FUNCTION IF EXISTS trigger_set_timestamp()`);

  // Drop table if exists
  pgm.dropTable("users", { ifExists: true, cascade: true });

  // Drop types if they exist
  const types = [
    "subscriptionType",
    "genderType",
    "countryType",
    "ageRangeType",
    "accountType",
    "profileType",
    "languagePreference",
  ];

  types.forEach((type) => {
    pgm.sql(`DROP TYPE IF EXISTS "${type}"`);
  });
};
