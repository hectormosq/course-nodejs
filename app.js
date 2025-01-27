const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const MONGO_URI = require("./util/connection").connectionParam;
const mongoConnect = require("./util/database").mongoConnect;
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();
const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views"); // Is default

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use((req, res, next) => {
  User.findById("67921d8ece2991921f015647")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
