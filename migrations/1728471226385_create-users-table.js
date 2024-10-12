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
  pgm.createTable("create_users_table", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    firstName: {
      type: "varchar(50)",
      notNull: true,
    },
    lastName: {
      type: "varchar(50)",
      notNull: true,
    },
    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
      
    },
    password: {
      type: "varchar(255)",
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}

 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("create_users_table");
};
