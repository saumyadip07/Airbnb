const express = require("express");
const connectDB = require("./app/config/databaseConfig.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const ejs = require("ejs");
const path = require("path");
const cors = require("cors");

dotenv.config();

const app = express();

// Connect to DB
connectDB();

// Session setup
app.use(
  session({
    secret: "express_session_secret", // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiration
      secure: false, // Set true if using HTTPS
    },
  })
);

// Middleware for flash messages
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(cors());
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("/views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/upload", express.static(path.join(__dirname, "upload")));

const wwwRouter = require("./app/router/www/www.router.js");
const apiRouter = require("./app/router/api/api.router.js");
const adminDashboardRouter = require("./app/router/admin/adminDashboard.router.js");
const vendorDashboardRouter = require("./app/router/vendor/vendorDashboard.router.js");

//frontend
app.use("/", wwwRouter);

//api
app.use("/api", apiRouter);

//admin
app.use("/admin", adminDashboardRouter);

//vendor
app.use("/vendor", vendorDashboardRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
