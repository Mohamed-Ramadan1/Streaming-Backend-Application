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
  // Create enum types for addressType
  pgm.createType("address_type", ["home", "work", "billing", "shipping"]);

  // Create user_addresses table
  pgm.createTable("user_addresses", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    userId: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
    },
    addressType: {
      type: "address_type",
      notNull: true,
    },
    streetAddress: {
      type: "varchar(255)",
      notNull: true,
    },
    city: {
      type: "varchar(100)",
      notNull: true,
    },
    state: {
      type: "varchar(100)",
    },
    postalCode: {
      type: "varchar(20)",
    },
    country: {
      type: "varchar(50)",
      notNull: true,
    },
    isPrimary: {
      type: "boolean",
      default: false,
    },
    createdAt: {
      type: "timestamptz",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: "timestamptz",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  // Create necessary indexes
  pgm.createIndex("user_addresses", "userId", { name: "idx_address_user" });
  pgm.createIndex("user_addresses", "addressType", {
    name: "idx_address_type",
  });
  pgm.createIndex("user_addresses", "country", { name: "idx_address_country" });

  // Create trigger to update 'updatedAt' before updating the table
  pgm.createTrigger("user_addresses", "set_timestamp_addresses", {
    when: "BEFORE",
    operation: "UPDATE",
    function: "trigger_set_timestamp",
    level: "ROW",
  });

  // Create unique index to ensure one primary address per user and address type
  // Create unique index to ensure one primary address per user and address type
  pgm.createIndex("user_addresses", ["userId", "addressType"], {
    name: "idx_primary_address",
    unique: true,
    where: '"isPrimary" = TRUE', // Wrap isPrimary in double quotes
  });

  // Create function to enforce single primary address per user and address type
  pgm.sql(`
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
  `);

  // Create trigger to maintain single primary address
  pgm.createTrigger("user_addresses", "trig_single_primary_address", {
    when: "BEFORE",
    operation: ["INSERT", "UPDATE"],
    function: "ensure_single_primary_address",
    level: "ROW",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop triggers and functions during rollback
  pgm.dropTrigger("user_addresses", "set_timestamp_addresses");
  pgm.dropTrigger("user_addresses", "trig_single_primary_address");
  pgm.sql(`DROP FUNCTION ensure_single_primary_address();`);

  // Drop indexes
  pgm.dropIndex("user_addresses", "userId", { name: "idx_address_user" });
  pgm.dropIndex("user_addresses", "addressType", { name: "idx_address_type" });
  pgm.dropIndex("user_addresses", "country", { name: "idx_address_country" });
  pgm.dropIndex("user_addresses", ["userId", "addressType"], {
    name: "idx_primary_address",
  });

  // Drop the user_addresses table
  pgm.dropTable("user_addresses");

  // Drop the address_type enum
  pgm.dropType("address_type");
};
