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
    var query = `INSERT INTO resturent (birger_name,Price) 
    VALUES('${vals.birger_name}',${vals.Price});
    
    
    
    `;
    connection.run(query, function (err, data) {
      if (err) {
        return cb(err);
      }
      var query2 = `
INSERT INTO UserFavorites (UserID, BurgerID, IsFav) 
VALUES ('${vals.userId}', ${this.lastID}, 0);
`;
      cb(null, this.lastID); // Return the ID of the inserted row
      connection.run(query2, function (er, da) {});
    });
  },

  updateOne: function (vals, cb) {
    var query = `
    UPDATE UserFavorites
 SET IsFav = ${vals.IsFav}
 WHERE UserID = ${vals.UserID} AND BurgerID = ${vals.BurgerID}; 
    `;

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
    const query = `SELECT username, email ,id FROM users WHERE email = ? AND password = ?`;

    // Use parameterized query to prevent SQL injection
    connection.all(query, [vals.email, converPass], function (err, results) {
      if (err) {
        return cb(err);
      }

      // Check if any user was found
      if (results.length === 0) {
        return cb(new Error("Invalid email or password"));
      }

      // If a user is found, create and return the token
      cb(null, CreateToken(vals.email.split("@")[0], results[0].id));
    });
  },
  register: function (vals, cb) {
    const converPass = btoa(vals.password);
    const query = `INSERT INTO users (username, email, password)
    VALUES ('${vals.username}','${vals.email}','${converPass}')`;
    connection.run(query, function (err, data) {
      if (err) {
        return cb(err);
      }

      cb(null, this.lastID); // Return the ID of the inserted row
    });
  },
  getFavBurger: function (vals, cb) {
    const query = `
     SELECT 
        U.username,
        B.birger_name,
        UF.BurgerID,
        UF.IsFav
    FROM 
        users U
    JOIN 
        UserFavorites UF ON U.id = UF.UserID
    JOIN 
        resturent B ON UF.BurgerID = B.id
    WHERE 
        U.id = ${vals} AND UF.IsFav = 1;
`;
    connection.all(query, [], function (err, results) {
      if (err) {
        return cb(err);
      }
      cb(null, results);
    });
  },
};

const CreateToken = (name, id) => {
  console.log(id);

  var oldDateObj = new Date();
  var newDateObj = new Date();
  newDateObj.setTime(oldDateObj.getTime() + 30 * 60 * 1000);
  console.log(newDateObj);
  let content = "";
  name = name.split("").reverse();
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  for (let index = 0; index < name.length; index++) {
    const e = name[index];
    const token = randomNumber(100000, 999999);
    content += `${e}-${token}`;
  }

  var Obj = {
    userName: name.reverse().join(""),
    expireDate: newDateObj,
    token: content,
    id: id,
  };

  return JSON.stringify(Obj);
};

module.exports = { ormBurger, ormUser };
