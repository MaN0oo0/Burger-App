const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const routes = require("./routes/handlers");
const path = require("path");
const fileURLToPath = require("url");
const PORT = process.env.PORT || 9001;
const app = express();
// const __filename = fileURLToPath();
// const __dirname = path.dirname(__filename);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    
  })
);
app.set("view engine", "handlebars");

app.use("/", routes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
