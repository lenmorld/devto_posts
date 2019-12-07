// server.js

const express = require("express");
const server = express();

const body_parser = require("body-parser");

// parse JSON (application/json content-type)
server.use(body_parser.json());

const port = 4000;

// << db setup >>
const db = require("./db");
const dbName = "data";
const collectionName = "movies";

db.initialize(dbName, collectionName, function (dbCollection) { // successCallback
   // get all items
   dbCollection.find().toArray(function (err, result) {
      if (err) throw err;
      console.log(result);

      // << return response to client >>
   });

   // << db CRUD routes >>
   server.post("/items", (request, response) => {
      const item = request.body;
      dbCollection.insertOne(item, (error, result) => { // callback of insertOne
         if (error) throw error;
         // return updated list
         dbCollection.find().toArray((_error, _result) => { // callback of find
            if (_error) throw _error;
            response.json(_result);
         });
      });
   });

   server.get("/items/:id", (request, response) => {
      const itemId = request.params.id;

      dbCollection.findOne({ id: itemId }, (error, result) => {
         if (error) throw error;
         // return item
         response.json(result);
      });
   });

   server.get("/items", (request, response) => {
      // return updated list
      dbCollection.find().toArray((error, result) => {
         if (error) throw error;
         response.json(result);
      });
   });

   server.put("/items/:id", (request, response) => {
      const itemId = request.params.id;
      const item = request.body;
      console.log("Editing item: ", itemId, " to be ", item);

      dbCollection.updateOne({ id: itemId }, { $set: item }, (error, result) => {
         if (error) throw error;
         // send back entire updated list, to make sure frontend data is up-to-date
         dbCollection.find().toArray(function (_error, _result) {
            if (_error) throw _error;
            response.json(_result);
         });
      });
   });

   server.delete("/items/:id", (req, res) => {
      const itemId = req.params.id;
      console.log("Delete item with id: ", itemId);

      dbCollection.deleteOne({ id: itemId }, function (err, result) {
         if (err) throw err;
         // send back entire updated list after successful request
         dbCollection.find().toArray(function (_err, _result) {
            if (_err) throw _err;
            res.json(_result);
         });
      });
   });

}, function (err) { // failureCallback
   throw (err);
});

server.listen(port, () => {
   console.log(`Server listening at ${port}`);
});