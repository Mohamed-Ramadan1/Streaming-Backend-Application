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
  pgm.createType("address_type", ["home", "work", "billing", "shipping"]);
  // Create user_addresses table
  pgm.createTable("user_addresses", {
    id: {
      type: "UUID",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    userId: {
      type: "UUID",
      notNull: true,
      references: "users(id)",
    },
    addressType: {
      type: `"address_type"`,
      notNull: true,
      //   check: "addressType IN ('home', 'work', 'billing', 'shipping')",
    },
    streetAddress: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    city: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    state: {
      type: "VARCHAR(100)",
    },
    postalCode: {
      type: "VARCHAR(20)",
    },
    country: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    isPrimary: {
      type: "BOOLEAN",
      default: false,
    },
    createdAt: {
      type: "TIMESTAMPTZ",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: "TIMESTAMPTZ",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  // Create indexes for user_addresses table
  pgm.createIndex("user_addresses", "userId", { name: "idx_address_user" });
  pgm.createIndex("user_addresses", "addressType", {
    name: "idx_address_type",
  });
  pgm.createIndex("user_addresses", "country", { name: "idx_address_country" });

  // Create trigger for updating 'updatedAt' in user_addresses table
  pgm.createTrigger("user_addresses", "set_timestamp_addresses", {
    when: "BEFORE",
    operation: "UPDATE",
    level: "ROW",
    function: "trigger_set_timestamp",
  });

  // Ensure only one primary address per user and address type
  pgm.createIndex("user_addresses", ["userId", "addressType"], {
    name: "idx_primary_address",
    unique: true,
    where: "isPrimary = TRUE",
  });

  // Create function to ensure only one primary address per user and address type
  pgm.createFunction(
    "ensure_single_primary_address",
    [],
    {
      returns: "trigger",
      language: "plpgsql",
      replace: true,
    },
    `
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
    `
  );

  // Create trigger to maintain single primary address
  pgm.createTrigger("user_addresses", "trig_single_primary_address", {
    when: "BEFORE",
    operation: ["INSERT", "UPDATE"],
    level: "ROW",
    function: "ensure_single_primary_address",
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop trigger for single primary address
  pgm.dropTrigger("user_addresses", "trig_single_primary_address");

  // Drop function for single primary address
  pgm.dropFunction("ensure_single_primary_address");

  // Drop trigger for updating 'updatedAt'
  pgm.dropTrigger("user_addresses", "set_timestamp_addresses");

  // Drop indexes
  pgm.dropIndex("user_addresses", "userId", { ifExists: true });
  pgm.dropIndex("user_addresses", "addressType", { ifExists: true });
  pgm.dropIndex("user_addresses", "country", { ifExists: true });
  pgm.dropIndex("user_addresses", ["userId", "addressType"], {
    ifExists: true,
  });

  // Drop user_addresses table
  pgm.dropTable("user_addresses", { ifExists: true });
};
