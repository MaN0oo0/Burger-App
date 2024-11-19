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
