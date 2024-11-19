const connection = require("./db");

const orm = {
  selectAll: function (tableInput, cb) {
    var query = `SELECT * FROM ${tableInput}`;
    connection.all(query, [], function (err, results) {
      if (err) {
        return cb(err);
      }
      cb(null, results); // Return results through the callback
    });
  },

  insertOne: function (vals, cb) {
    var query = `INSERT INTO resturent (birger_name,isFav,Price) 
    VALUES('${vals.birger_name}',0,${vals.Price});`;
    connection.run(query, function (err, data) {
      if (err) {
        return cb(err);
      }

      cb(null, this.lastID); // Return the ID of the inserted row
    });
  },

  updateOne: function (vals, condition, cb) {
    // const setClause = cols.map((col) => `${col} = ?`).join(", ");
    var query = `UPDATE resturent SET isFav =${vals}
     WHERE id=${condition}`;
    connection.run(query, function (err) {
      if (err) {
        return cb(err);
      }
      cb(null, this.changes); // Return the number of changed rows
    });
  },

  deleteOne: function (condition, cb) {
    var query = `DELETE FROM resturent WHERE id=${condition}`;
    connection.run(query, function (err) {
      if (err) {
        return cb(err);
      }
      cb(null, this.changes); // Return the number of deleted rows
    });
  },
  getAllBy: function (condition, cb) {
    var query = `SELECT * FROM resturent WHERE birger_name LIKE '%${condition}%'`;
    connection.all(query, [], function (err, results) {
      if (err) {
        return cb(err);
      }
      console.log(results);

      cb(null, results); // Return results through the callback
    });
  },
  getAllFav: function (condition, cb) {
    var query = `SELECT * FROM resturent WHERE isFav =${condition}`;
    connection.all(query, [], function (err, results) {
      if (err) {
        return cb(err);
      } else cb(null, results); // Return results through the callback
    });
  },
};

module.exports = orm;
