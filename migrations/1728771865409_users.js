/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Create custom types
  pgm.createType("subscriptionType", ["free", "basic", "premium"]);
  pgm.createType("accountType", ["personal", "business", "admin"]);
  pgm.createType("genderType", ["male", "female", "non_binary"]);

  // Create users table
  pgm.createTable("users", {
    id: {
      type: "UUID",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    firstName: { type: "VARCHAR(100)", notNull: true },
    lastName: { type: "VARCHAR(100)", notNull: true },
    password: {
      type: "VARCHAR(255)",
      notNull: true,
      check: "length(password) >= 8",
    }, // Minimum password length
    passwordSalt: { type: "VARCHAR(255)" },
    passwordResetToken: { type: "VARCHAR(255)" },
    passwordResetExpires: { type: "TIMESTAMPTZ" },
    email: { type: "VARCHAR(255)", notNull: true, unique: true },
    roles: { type: "jsonb", default: pgm.func("'[\"user\"]'::jsonb") }, // User roles, e.g., admin, user
    phoneNumber: {
      type: "VARCHAR(20)",
      unique: true,
      check: "phoneNumber ~ '^\\+[1-9]\\d{1,14}$'", // Validate international phone number format
    },
    streetAddress: { type: "VARCHAR(255)" },
    city: { type: "VARCHAR(100)" },
    state: { type: "VARCHAR(100)" },
    postalCode: { type: "VARCHAR(20)" },
    country: { type: "VARCHAR(50)" },
    age: { type: "INTEGER" },
    gender: { type: "genderType" },
    profileImage: { type: "VARCHAR(255)", nullable: true },
    profileImagePublicId: { type: "VARCHAR(255)", nullable: true },
    dateOfBirth: { type: "DATE", nullable: true },
    subscriptionPlan: { type: "subscriptionType", default: "free" },
    isEmailVerified: { type: "BOOLEAN", default: false },
    emailVerificationToken: { type: "VARCHAR(255)" },
    emailVerificationTokenExpiresAt: { type: "TIMESTAMPTZ" },
    isSubscriptionActive: { type: "BOOLEAN", default: false },
    isAccountActive: { type: "BOOLEAN", default: false },
    isNotificationMuted: { type: "BOOLEAN", default: false },
    metadata: { type: "jsonb", nullable: true }, // Additional user metadata
    accountType: { type: "accountType", default: "personal" },
    createdAt: { type: "TIMESTAMPTZ", default: pgm.func("CURRENT_TIMESTAMP") },
    updatedAt: { type: "TIMESTAMPTZ", default: pgm.func("CURRENT_TIMESTAMP") },
    deletedAt: { type: "TIMESTAMPTZ", nullable: true },
  });

  // Create indexes for improved performance
  pgm.createIndex("users", "email");
  pgm.createIndex("users", "isEmailVerified");
  pgm.createIndex("users", "isAccountActive");
  pgm.createIndex("users", "phoneNumber");
  pgm.createIndex("users", "dateOfBirth");
  pgm.createIndex("users", "country");

  // Create a trigger function for automatically updating the updatedAt field
  pgm.sql(`
      CREATE OR REPLACE FUNCTION users_set_timestamp() 
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
  `);

  // Create trigger to call the users_set_timestamp function before every update
  pgm.createTrigger("users", "update_timestamp", {
    before: true,
    eachRow: true,
    on: "UPDATE",
    function: "users_set_timestamp",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTrigger("users", "update_timestamp");
  pgm.sql(`DROP FUNCTION IF EXISTS users_set_timestamp()`);

  // Drop indexes
  pgm.dropIndex("users", "email");
  pgm.dropIndex("users", "isEmailVerified");
  pgm.dropIndex("users", "isAccountActive");
  pgm.dropIndex("users", "phoneNumber");
  pgm.dropIndex("users", "dateOfBirth");
  pgm.dropIndex("users", "country");

  // Drop users table
  pgm.dropTable("users");

  // Drop ENUM types
  pgm.dropType("subscriptionType");
  pgm.dropType("accountType");
  pgm.dropType("genderType");
};
