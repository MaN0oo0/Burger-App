const express = require("express");
const router = express.Router();
const orm = require("../config/orm");
var store = require("store");
router.get("/", (req, res) => {
  orm.ormBurger.selectAll("resturent", (err, burgers) => {
    if (err) {
      console.error(err);
    } else {
      if (store.get("token")) {
        res.render("index", {
          title: "Home",
          script: "main",
          burgers,
          active: "active",
          home: "true",
          token: store.get("token"),
          username: store.get("name"),
        });
      } else {
        res.render("index", {
          title: "Home",
          script: "main",
          burgers,
          active: "active",
          home: "true",
        });
      }
    }
  });
});

router.get("/testredux", (req, res) => {
  res.render("testredux", {
    title: "testredux",
    script: "testredux",
    active: "active",
    testredux: "true",
  });
});
router.get("/account", (req, res) => {
  var query = req.query.action;
  if (query === "login") {
    res.render("account", {
      title: "Login",
      script: "login",
      active: "active",
      login: "true",
    });
  } else if (query === "register") {
    res.render("account", {
      title: "Register",
      script: "register",
      active: "active",
      register: "true",
    });
  }
});

router.get("/favorites", (req, res) => {
  orm.ormBurger.getAllFav("1", (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log(results);

      if (store.get("token")) {
        res.render("favorites", {
          title: "Favorites",
          favList: results,
          script: "main",
          active: "active",
          favorites: "true",
          token: store.get("token"),
          username: store.get("name"),
        });
      } else {
        res.render("favorites", {
          title: "Favorites",
          favList: results,
          script: "main",
          active: "active",
          favorites: "true",
        });
      }
    }
  });
});

router.get("/logout", (req, res) => {
  store.remove("token");
  store.remove("name");
  res.redirect("/");
});

//#region  Burger api

router.post("/add", (req, res) => {
  const { birger_name, Price } = req.body;
  orm.ormBurger.insertOne(req.body, (err, burger) => {
    if (err) {
      console.error(err);
      res.status(401);
      res.json({
        message: "Error adding burger",
      });
    } else {
      res.status(200);
      console.log(burger);
      res.json({
        message: "Burger added successfully",
        burger: {
          id: burger,
          birger_name: birger_name,
          isFav: 0,
          Price: Price,
        },
      });
    }
  });
});

router.delete("/delete", (req, res) => {
  const id = req.body.id;
  orm.ormBurger.deleteOne(id, (err, results) => {
    if (err) {
      console.error(err);
      res.status(401);
      res.json({
        message: "Error deleting burger",
      });
    } else {
      res.status(200);
      console.log(results);
      res.json({
        message: "Burger deleted successfully",
      });
    }
  });
});
router.put("/UpdateFav", (req, res) => {
  const { id, isFav } = req.body;

  orm.ormBurger.updateOne(isFav, id, (err, results) => {
    if (err) {
      console.error(err);
      res.status(401);
      res.json({
        message: "Error updating burger",
      });
    } else {
      res.status(200);
      console.log(results);
      res.json({
        message: "Burger updated successfully",
      });
    }
  });
});
router.get(`/search`, (req, res) => {
  const search = req.query.searchTerm;
  if (search) {
    orm.ormBurger.getAllBy(search, (err, results) => {
      if (err) {
        console.error(err);
        res.render("search", {
          title: "Search Page",
          SearchTerm: search,
        });
      } else {
        res.render("search", {
          searchResults: results,
          title: "Search Page",
          SearchTerm: search,
          script: "main",
        });
      }
    });
  } else {
    res.render("search", {
      title: "Search Page",
      SearchTerm: " ",
      script: "main",
    });
  }
});

//#endregion
//=================Auth Apis =====================\\
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  orm.ormUser.auth(req.body, (err, results) => {
    if (err) {
      console.error(err);
      res.status(401);
    } else {
      var reslt = JSON.parse(results);
      console.log(reslt);

      store.set("token", reslt.token);
      store.set("name", reslt.userName);
      res.json({
        message: "Login successful",
        data: reslt,
      });
    }
  });
});

module.exports = router;
