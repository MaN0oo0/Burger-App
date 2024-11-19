const express = require("express");
const router = express.Router();
const orm = require("../config/orm");
router.get("/", (req, res) => {
  orm.selectAll("resturent", (err, burgers) => {
    if (err) {
      console.error(err);
    } else {
      res.render("index", {
        title: "Home",
        script: "main",
        burgers,
      });
    }
  });
});

router.get("/favorites", (req, res) => {
  orm.getAllFav("1", (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log(results);
      res.render("favorites", {
        title: "Favorites",
        favList: results,
        script: "main",
      });
    }
  });
});

router.post("/add", (req, res) => {
  const birgername = req.body.birger_name;
  orm.insertOne(birgername, (err, burger) => {
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
          birger_name: birgername,
          isFav: 0,
        },
      });
    }
  });
});

router.delete("/delete", (req, res) => {
  const id = req.body.id;
  orm.deleteOne(id, (err, results) => {
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

  orm.updateOne(isFav, id, (err, results) => {
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
    orm.getAllBy(search, (err, results) => {
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
  }
});

module.exports = router;
