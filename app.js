const express = require("express");
const app = express();
const connectToDb = require("./config/db");
require("dotenv").config();
const logging = require("./middlewares/logging");
const { errorHandler, notFound } = require("./middlewares/error_handler");
const path = require("path");
const helemt = require("helmet");
const cors = require("cors");

//Connect to database
connectToDb();

app.use(express.static(path.join(__dirname, "images")));

// Apply middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logging);

// Helmet
app.use(helemt());

// Cors
app.use(cors());

// Set View Engine
app.set("view engine", "ejs");

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/password", require("./routes/password"));
app.use("/api/upload", require("./routes/upload"));

//Error not found 404
app.use(notFound);

//Error handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`> server is running in ${process.env.NODE_ENV}`);
});
