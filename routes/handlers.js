const express = require("express");
const router = express.Router();
const orm = require("../config/orm");
var store = require("store");
const e = require("express");

const requireAuth = (req, res, next) => {
  if (store.get("token")) {
    next(); // User is authenticated, continue to next middleware
  } else {
    res.render("account", {
      title: "Login",
      script: "login",
      active: "active",
      login: "true",
    });
    // res.redirect("/account");
    // User is not authenticated, redirect to login page
  }
};
router.get("/", requireAuth, (req, res) => {
  orm.ormBurger.selectAll("resturent", (err, burgers) => {
    orm.ormBurger.getAllFavIds("1", Number(store.get("id")), (err, count) => {
      if (err) {
        console.error(err);
      } else {
        const ids = count.map((e) => e.BurgerID);
        let newArray = [];
        burgers.forEach((burger) => {
          if (ids.includes(burger.id)) {
            newArray.push({
              id: burger.id,
              birger_name: burger.birger_name,
              Price: burger.Price,
              isFav: true,
            });
          } else {
            newArray.push({
              id: burger.id,
              birger_name: burger.birger_name,
              Price: burger.Price,
              isFav: false,
            });
          }
        });

        res.render("index", {
          title: "Home",
          script: "main",
          burgers: newArray,
          active: "active",
          home: "true",
          token: store.get("token"),
          username: store.get("name"),
          favCount: count.length,
        });
      }
    });
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

  if (query === "register") {
    res.render("account", {
      title: "Register",
      script: "register",
      active: "active",
      register: "true",
    });
  } else {
    res.render("account", {
      title: "Login",
      script: "login",
      active: "active",
      login: "true",
    });
  }
});

router.get("/profile", requireAuth, (req, res) => {
  res.render("profile", {
    title: "Profile",
    script: "profile",
    active: "active",
    profile: "true",
    token: store.get("token"),
    username: store.get("name"),
  });
});

router.get("/favorites", (req, res) => {
  orm.ormUser.getFavBurger(Number(store.get("id")), (err, results) => {
    if (err) {
      console.error(err);
    } else {
      res.render("favorites", {
        title: "Favorites",
        favList: results,
        script: "main",
        active: "active",
        favorites: "true",
        token: store.get("token"),
        username: store.get("name"),
      });
    }
  });
});

router.get("/logout", (req, res) => {
  store.remove("token");
  store.remove("name");
  res.redirect("/");
});

//#region  Burger api

router.post("/add", requireAuth, (req, res) => {
  const { birger_name, Price } = req.body;
  orm.ormBurger.insertOne(
    { birger_name, Price, userId: store.get("id") },
    (err, burger) => {
      if (err) {
        console.error(err);
        res.status(401);
        res.json({
          message: "Error adding burger",
        });
      } else {
        res.status(200);

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
    }
  );
});

router.delete("/delete", requireAuth, (req, res) => {
  const id = req.body.id;
  orm.ormBurger.deleteOne(id, store.get("id"), (err, results) => {
    if (err) {
      console.error(err);
      res.status(401);
      res.json({
        message: "Error deleting burger",
      });
    } else {
      res.status(200);

      res.json({
        message: "Burger deleted successfully",
      });
    }
  });
});
router.put("/UpdateFav", requireAuth, (req, res) => {
  const { id, isFav } = req.body;
  orm.ormBurger.updateOne(
    { UserID: Number(store.get("id")), BurgerID: id, IsFav: isFav },
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(401);
        res.json({
          message: "Error updating burger",
        });
      } else {
        res.status(200);

        res.json({
          message: "Burger updated successfully",
        });
      }
    }
  );
});
router.get(`/search`, requireAuth, (req, res) => {
  const search = req.query.searchTerm;
  if (search) {
    orm.ormBurger.getAllBy(search, (err, results) => {
      if (err) {
        res.render("search", {
          title: "Search Page",
          token: store.get("token"),
          username: store.get("name"),
          error: err,
        });
      } else {
        res.render("search", {
          searchResults: results,
          title: "Search Page",
          SearchTerm: search,
          script: "main",
          token: store.get("token"),
          username: store.get("name"),
        });
      }
    });
  } else {
    res.render("search", {
      title: "Search Page",
      SearchTerm: " ",
      script: "main",
      token: store.get("token"),
      username: store.get("name"),
    });
  }
});

router.get("/getFavCount", requireAuth, (req, res) => {
  const burgerId = req.query.burgerId;
  orm.ormBurger.getAllFavIds(
    burgerId,
    Number(store.get("id")),
    (err, count) => {
      if (err) {
        res.json({
          message: "Error getting favorite count",
        });
      } else {
        res.json({
          count: count,
        });
      }
    }
  );
});

//#endregion
//=================Auth Apis =====================\\
router.post("/login", (req, res) => {
  orm.ormUser.auth(req.body, (err, results) => {
    if (err) {
      res.status(401).json({ message: err.message });
    } else {
      var reslt = JSON.parse(results);
      store.set("token", reslt.token);
      store.set("name", reslt.userName);
      store.set("id", reslt.id);

      res.json({
        message: "Login successful",
      });
    }
  });
});

router.post("/register", (req, res) => {
  orm.ormUser.register(req.body, (err, results) => {
    if (err) {
      res.status(401).json({ message: err.message });
    } else {
      res.json({
        message: "Register successful",
      });
    }
  });
});

//#region secure files

//#endregion
module.exports = router;
