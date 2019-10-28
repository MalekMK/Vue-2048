var socket = require("socket.io");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  // we're connected!
});

var Schema = mongoose.Schema;

var dashboardSchema = new Schema({
  name: String,
  score: Number,
  gridSize: Number
});
var Dashboard = mongoose.model("Dashboard", dashboardSchema);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function(req, res) {
  Dashboard.find({}, function(err, docs) {
    res.send(docs);
  });
});
app.post("/", function(req, res) {
  var player = new Dashboard(req.body);
  player.save(function(err) {
    if (err) return handleError(err);
    // saved!
  });
  res.send("ok");
});

let server= app.listen(3000);
// Socket setup & pass server
var io = socket(server);
io.on("connection", socket => {
  console.log("made socket connection", socket.id);
  // Handle chat event
  socket.on("scoreChange", function(data) {
    // console.log(data);
    io.sockets.emit("scoreChange", data);
  });
});


