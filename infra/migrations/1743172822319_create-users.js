exports.up = (pgm) => {
    pgm.createTable("users", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },
        // For referencie, GitHub username max length is 39 characters.
        username: { 
            type: "varchar(30)",
            notNull: true,
            unique: true 
        },
        // Why 254 in length?  https://stackoverflow.com/a/1199238
        email: { 
            type: "varchar(254)",
            notNull: true,
            unique: true 
        },
        // Why 254 in legth? https://security.stackexchange.com/a/39851
        password: { 
            type: "varchar(254)", 
            notNull: true 
        },
        createdAt: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("current_timestamp"),
        },
        // updatedAt: {
        //     type: "timestamp",
        //     notNull: true,
        //     default: pgm.func("current_timestamp"),
        // },
    });
};


exports.down = false;
