const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const routes = require("./routes/handlers");
const path = require("path");
const fileURLToPath = require("url");
const PORT = process.env.PORT || 9001;
const app = express();
const session = require("express-session");
const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  // helpers: require("./config/handlebars-helpers"), //only need this
  helpers: {
    // eq: function (a, b) {
    //   console.log("a",a);
    //   console.log("b",b);
      
    //   if (a === b) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    //   // return value + 7;
    // },
    favList: function (val, val2, option) {
      // console.log("ssss", val);

      return val.includes(val2)
        ? options.fn(`<span class="badge bg-secondary p-2 PricArea">fav</span>`)
        : options.fn("");
    },
  },
});
// const __filename = fileURLToPath();
// const __dirname = path.dirname(__filename);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(bodyParser.json());

app.use(methodOverride("_method"));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
