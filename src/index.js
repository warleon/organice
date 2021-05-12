const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const handlebars = require("express-handlebars");

//initial
const app = express();
require("./database");

//settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  handlebars({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    helpersDir: path.join(__dirname, "helpers"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "hola",
    resave: true,
    saveUninitialized: true,
  })
);

//global variables

//routes
app.use(require("./routes/index"));
app.use(require("./routes/activity"));
app.use(require("./routes/user"));

//static files
app.use(express.static(path.join(__dirname, "public")));

//server is listening
app.listen(app.get("port"), () => {
  console.log("listening on port " + app.get("port"));
});
