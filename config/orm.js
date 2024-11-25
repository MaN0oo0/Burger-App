const connection = require("./db");

const ormBurger = {
  selectAll: function (tableInput, cb) {
    var query = `SELECT * FROM ${tableInput}`;
    connection.all(query, [], function (err, results) {
      if (err) {
        return cb(new Error("Internal Error Occured"));
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
        return cb(new Error("Internal Error Occured"));
      }

      cb(null, this.lastID); // Return the ID of the inserted row
    });
  },

  updateOne: function (vals, cb) {
    var CheckExistFrst = `
    SELECT * FROM UserFavorites WHERE UserID = ? AND BurgerID = ?;
    `;
    connection.all(
      CheckExistFrst,
      [vals.UserID, vals.BurgerID],
      (err, data) => {
        if (err) {
          return cb(new Error("Internal Error Occurred CheckExistFrst"));
        } else {
          if (data.length > 0) {
            // Check if any records exist
            var queryUpdate = `
                UPDATE UserFavorites
                SET IsFav = ?
                WHERE UserID = ? AND BurgerID = ?; 
                `;
            connection.run(
              queryUpdate,
              [vals.IsFav, vals.UserID, vals.BurgerID],
              function (err) {
                if (err) {
                  return cb(new Error("Internal Error Occurred queryUpdate"));
                }
                cb(null, vals.BurgerID); // Return the number of changed rows
              }
            );
          } else {
            var queryInsert = `
                INSERT INTO UserFavorites (UserID, BurgerID, IsFav) 
                VALUES (?, ?, ?);
                `;
            connection.run(
              queryInsert,
              [vals.UserID, vals.BurgerID, vals.IsFav],
              function (err) {
                if (err) {
                  return cb(new Error("Internal Error Occurred queryInsert"));
                }
                cb(null, vals.BurgerID); // Return the number of changed rows
              }
            );
          }
        }
      }
    );
  },
  deleteOne: function (condition, userId, cb) {
    var query1 = `DELETE FROM resturent WHERE id=${condition}`;
    connection.run(query1, function (err) {
      if (err) {
        return cb(new Error("Internal Error Occured query1"));
      } else {
        var query2 = `DELETE FROM UserFavorites WHERE UserID=${userId} AND BurgerID=${condition}`;
        connection.run(query2, function (err) {
          if (err) {
            return cb(new Error("Internal Error Occured query2"));
          }
          cb(null, this.changes);
        });
      }
    });
  },
  getAllBy: function (condition, cb) {
    var query = `SELECT * FROM resturent WHERE birger_name LIKE '%${condition}%'`;
    connection.all(query, [], function (err, results) {
      if (err) {
        return cb(new Error("Internal Error Occured"));
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

  getAllFavIds: function (condition, userId, cb) {
    // var query = `SELECT COUNT(*) as count FROM UserFavorites WHERE isFav =${condition}`;
    var query = `SELECT BurgerID  FROM UserFavorites WHERE isFav =${condition} AND UserID=${userId}`;
    connection.all(query, [], function (err, results) {
      if (err) {
        return cb(err);
      }

      cb(null, results);
    });
  },
};
const ormUser = {
  auth: function (vals, cb) {
    const converPass = btoa(vals.password);
    const query = `SELECT username, email ,id FROM users WHERE email = ? AND password = ?`;

    // Use parameterized query to prevent SQL injection
    connection.get(query, [vals.email, converPass], function (err, results) {
      if (err) {
        return cb(new Error("Internal Error Occured"));
      }

      // // Check if any user was found
      if (!results) {
        return cb(new Error("Invalid email or password"));
      }

      // If a user is found, create and return the token
      cb(null, CreateToken(results.username, results.id));
    });
  },
  register: function (vals, cb) {
    const converPass = btoa(vals.password);
    const query = `INSERT INTO users (username, email, password)
    VALUES ('${vals.username}','${vals.email}','${converPass}')`;
    connection.run(query, function (err, data) {
      if (err) {
        return cb(new Error("Internal Error Occured"));
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
        UF.IsFav,
        B.Price
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
  console.log("old", oldDateObj);

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
