var socket = require("socket.io");
var express = require("express");
const http = require('http');
var app = express();
const cors = require('cors');
const server = http.createServer(app);
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

app.use(cors());
mongoose.connect("mongodb://localhost/vue2048", { useNewUrlParser: true });
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

// Socket setup & pass server
var io = socket(server);
io.on("connection", socket => {
  // Handle chat event
  socket.on("changingScore", (data) => {
    io.sockets.emit("scoreChange", data);
  });
});

server.listen(3500,  () => console.log(`Server has started.`));
