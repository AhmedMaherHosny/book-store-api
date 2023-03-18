const express = require("express");
const app = express();
const connectToDb = require("./config/db");
require("dotenv").config();
const logging = require("./middlewares/logging");
const { errorHandler, notFound } = require("./middlewares/error_handler");

//Connect to database
connectToDb();

// Apply middlewares
app.use(express.json());
app.use(logging);

// Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));

//Error not found 404
app.use(notFound);

//Error handler
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`> server is running in ${process.env.NODE_ENV}`);
});
