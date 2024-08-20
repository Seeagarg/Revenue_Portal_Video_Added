var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

require("dotenv").config();
var cors = require("cors");
const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const fiteenFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var misportalRouter=require("./routes/misportalApi/misportal.router")
var advertiserRouter=require("./routes/advertiseApi/advertise.router")
var projectRouter=require("./routes/projectDetailsApi/project.router")
const { truncatenInsert } = require("./TruncateTableDaily");
const{sendMessage}=require('./routes/teligramNotification/noification_bot')

var {auth}=require("./middleware/auth")

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:3019",
      "http://localhost:3001",
      "http://192.168.1.34:3000",
      "https://url.promotrking.com",
      "https://reports.visiontrek.in",
      "http://reports.visiontrek.in",
      "http://reports.toon-flix.com"
    ],
  })
);

console.log(" NExt time ", twentyFourHours);


setTimeout(() => {
  truncatenInsert();
}, fiteenFourHours);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);

setInterval(()=>{
  //  sendMessage()
}, 1* 5* 1000);

app.use("/users", usersRouter);

app.use("/open", misportalRouter);
app.use("/secure/",auth,misportalRouter);

app.use("/api/v1",auth,advertiserRouter)

app.use("/api/v1",auth,projectRouter)

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.get("/*", function (req, res) {
  console.log("HEREEE");
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

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
  res.render("error");
});



module.exports = app;



