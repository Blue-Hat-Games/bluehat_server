var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const errorMsg = require("./message/errorMsg");

var indexRouter = require("./routes");
var usersRouter = require("./routes/users");
var nftRouter = require("./routes/nft");
var authRouter = require("./routes/auth");
var animalRouter = require("./routes/animal");
var marketRouter = require("./routes/market");
var app = express();

// Default Setting
const port = process.env.PORT || 3000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// Router Setting
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/nft", nftRouter);
app.use("/auth", authRouter);
app.use('/animal', animalRouter);
app.use('/market', marketRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (err.status === 404) {
    res.send(errorMsg.pageNotFound);
  }
  else{
  res.send(errorMsg.internalServerError);
  }
});

module.exports = app;
