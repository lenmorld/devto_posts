// import express and init server using express()
const express = require("express");
const server = express();

const port = 4001;

server.use(express.static("public"));

server.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

// all backend routes go here under /api
server.get("/api/json", function(req, res) {
	res.json({ name: "Lenny" });
});

server.listen(port, function() {
	// Callback function
	console.log("Running server at " + port);
});
