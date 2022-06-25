var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");

// Message setting
const errorMsg = require("./message/msg_error");
const infoMsg = require("./message/msg_info");

var usersRouter = require("./routes/users");
var nftRouter = require("./routes/nft");
var authRouter = require("./routes/auth");
var animalRouter = require("./routes/animal");
var marketRouter = require("./routes/market");
const logger = require("./config/logger");
var app = express();

// Default Setting
const port = process.env.PORT || 3000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ 
  limit : '50mb',
  extended: false }));
app.use(cookieParser());

// index page status setting
app.use("/", function (req, res, next) {
  res.status(200).send(infoMsg.success);
});

// router setting
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
    logger.error('404 Not Found: ' + req.method + ' ' + req.url);
    res.send(errorMsg.pageNotFound);
  }
  else {
    logger.error(err.status + ' ' + req.method + ' ' + req.url + ': ' + err.message);
    res.send(errorMsg.internalServerError);
  }
});

module.exports = app;
