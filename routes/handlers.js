const express = require("express");
const router = express.Router();
const orm = require("../config/orm");
router.get("/", (req, res) => {
  orm.ormBurger.selectAll("resturent", (err, burgers) => {
    if (err) {
      console.error(err);
    } else {
      res.render("index", {
        title: "Home",
        script: "main",
        burgers,
        active: "active",
        home: "true",
      });
    }
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
      res.render("favorites", {
        title: "Favorites",
        favList: results,
        script: "main",
        active: "active",
        favorites: "true",
      });
    }
  });
});

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

module.exports = router;
