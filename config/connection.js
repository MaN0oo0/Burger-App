const db = require("./db");

// const createTableQuery = `
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY,
//     username TEXT NOT NULL,
//     email TEXT NOT NULL
//   )
// `;  //  query to create a table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS resturent (
    id INTEGER PRIMARY KEY,
    birger_name TEXT NOT NULL,
    isFav BOOLEAN NOT NULL
  )
`;

/**
 * 
 * DROP TABLE IF EXISTS resturent;
    DROP TABLE IF EXISTS users;

-- CREATE TABLE resturent (
--       id INTEGER PRIMARY KEY AUTOINCREMENT,
--     birger_name TEXT NOT NULL,
--     isFav BOOLEAN NOT NULL
-- );

-- CREATE TABLE users (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--      username TEXT NOT NULL,
--      email TEXT NOT NULL,
--      password TEXT NOT NULL,
--      resturent_id INTEGER NOT NULL,
--     FOREIGN KEY (resturent_id) REFERENCES resturent (id)
-- );
 * 
 */

// const tablName = "users";
// const dropTablse = `
// DROP TABLE IF EXSTS ${tablName}
// `;

// Connect to the SQLite database and execute the create table query
db.serialize(() => {
  db.run(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Table created successfully.");
    }
  });
});
