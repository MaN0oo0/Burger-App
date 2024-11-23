const connection = require("./db");

const ormBurger = {
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
const ormUser = {
  auth: function (vals, cb) {
    const converPass = btoa(vals.password);
    var query = `SELECT (username,email)  FROM users WHERE email=${vals.email} and password = ${converPass};`;
    connection.all(query, [], function (err, results) {
      if (err) {
        return cb(err);
      }
      CreateToken(vals.email.split("@")[0])
       cb(null, results);
    });
  },
};

const CreateToken = (name) => {
  var oldDateObj = new Date();
  var newDateObj = new Date();
  newDateObj.setTime(oldDateObj.getTime() + 30 * 60 * 1000);
  console.log(newDateObj);
  dateExpire.set;
  let content = "";
  name = name.split("").reverse();
  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  for (let index = 0; index < name.length; index++) {
    const e = name[index];
    const token = randomNumber(100000, 999999);
    content += `${e}-${token}`;
  }

  var Obj = {
    userName: name,
    expireDate: newDateObj,
    token: content,
  };

  return JSON.stringify(Obj);
};

module.exports = { ormBurger };
