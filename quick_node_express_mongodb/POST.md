---
title: REST API with Cloud MongoDB, Node, and Express in 5 minutes
published: false
description: Connect to Mongo DB cloud with Node and Express in 5 minutes
tags: #node, #express, #database, #nosql
cover_image: https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg
series: Building Node and Express Stuff in 5 minutes
---

Let's bring the data to the cloud this time! 💾 ☁
We'll be using the free cluster of Mongo DB Atlas.

## What is Mongo DB Atlas?

> Mongo DB Atlas is a fully-managed database-as-a-service available on AWS, Azure, and GCP

Before Atlas, I used **mLab**, which was then acquired by MongoDB last year. Similar to mLab, MongoDB Atlas is arguably the easiest way to have a cloud MongoDB instance.

**Why?**

- 🏃‍♂️ **Quick, simple, and fast**: no installation and config files. After signing up and creating a cluster (takes 5 minutes), you're all set.

- ☁ **It's in the cloud**: Not running in your machine as a Mongo service. Not in a disk file like `diskdb`. You can manage it from anywhere through the Atlas web app. For your app, you only need a connection URL to access the db.

- 😎 **Very cool UI**: Atlas dashboard is very intuitive, and first-time users will find it easy to use with the visual cues and steps.

# Cloud setup

_There might be some slight screenshot differences to the actual Atlas UI by the time you do this, but the described steps should get you to the same results._

### 1. First sign up here:

https://www.mongodb.com/cloud/atlas/register

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1575603471/devto/quick_node_express_mongodb/2019-09-14-15-19-41.png)

### 2. Create a free tier _Starter Cluster_

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1575603471/devto/quick_node_express_mongodb/2019-12-01-19-33-18.png)

The free **Starter Cluster M0** comes with 512 MB Storage, shared RAM and vCPU.

This should be more than enough for our starter Node project.

- _Cluster region_: you can pick any provider (AWS, Google, Azure) and the region closest to you that has a Free Tier. For me, it was AWS us-east-1.

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1575603471/devto/quick_node_express_mongodb/2019-09-14-16-15-51.png)

- You can leave the rest at FREE defaults.

- Create the cluster.

  _The creation and provisioning might take a few minutes_

- Afterwards, the dashboard appears, with the **side panel** that contains all the options needed to manage clusters.

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1575603471/devto/quick_node_express_mongodb/2019-12-01-20-51-36.png)

### 3. Connect to the Cluster

Click [**Connect**] in the Cluster we have just created.

The dialog that appears gives options to:

1. Whitelist your IP address
2. Create a MongoDB user

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1575603471/devto/quick_node_express_mongodb/2019-12-01-20-55-07.png)

### 3.1 Whitelist IP Address

> _Whitelisting_ means only allowing access to selected (thus trusted) entities

- [**Add Your Current IP address**], which should automatically get your current public IP address. Optionally add a description such as "My Home IP address"

  - ☝ Remember to do this step again when you switch WiFi, e.g. when moving from coffee shop to home WiFi.

  - 💣You can use `0.0.0.0/0` to **enable all IP addresses** anywhere, which simplifies this process, but makes it VERY INSECURE.

### 3.2 Create admin user.

Enter your preferred **username** and **password**. This will be the first admin ("root") user, then [**Create MongoDB User**].

- Keep these credentials handy, since we'll use them later.

- Close the window. We'll connect to the cluster later.

### 4. 📃 Add sample data

From the cluster view, click [**Collections**], then [**Add my Own Data**]

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1575603471/devto/quick_node_express_mongodb/2019-09-15-20-32-17.png)

- Same as the last lesson, we use: - database name: `data` - collection name: `movies`

**Insert Document**

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1575603471/devto/quick_node_express_mongodb/2019-09-15-20-35-59.png)

- Insert a movie entry, as before - Leave the given `_id` provided by Atlas since this is internal

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1575603471/devto/quick_node_express_mongodb/2019-09-15-20-37-52.png)

- Now we see the inserted data in the dashboard. Add more as you wish

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1575603471/devto/quick_node_express_mongodb/2019-09-15-20-39-09.png)

Perfect. Now we got data. Time to connect to the cluster

### 5. 🔌 Connect to cluster

Go back to the Clusters view, then click Connect in our cluster.

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1575603471/devto/quick_node_express_mongodb/2019-09-14-16-34-22.png)

Choose [**Connect your Application**]

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1575603471/devto/quick_node_express_mongodb/2019-09-14-16-34-50.png)

Leave the default Node.js version 3+

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1575603471/devto/quick_node_express_mongodb/2019-09-15-20-16-35.png)

Copy the _Connection String_. We'll use this in the next step.

Now we're ready to dive into code!

![Dive](https://media.giphy.com/media/5zkZRNNb7WW8B9iN3Q/giphy.gif)

# Connecting to the db

1. Grab the starter code from last chapter here:

https://github.com/lenmorld/devto_posts/tree/master/quick_node_express_diskdb

2. Install `mongodb` driver

```bash
$ npm install mongodb
```

2. Create a new file called `db.js` in the app root.

Use this snippet, and replace `CONNECTION_STRING_FROM_ATLAS` with your connection string.

It should look a bit like this
`mongodb+srv://myusername:mypassword@cluster0-somelocation.mongodb.net/test?retryWrites=true&w=majority`

```javascript
// db.js

// mongodb driver
const MongoClient = require("mongodb").MongoClient;

const dbConnectionUrl = "CONNECTION_STRING_FROM_ATLAS";

function initialize(
	dbName,
	dbCollectionName,
	successCallback,
	failureCallback
) {
	MongoClient.connect(dbConnectionUrl, function(err, dbInstance) {
		if (err) {
			console.log(`[MongoDB connection] ERROR: ${err}`);
			failureCallback(err); // this should be "caught" by the calling function
		} else {
			const dbObject = dbInstance.db(dbName);
			const dbCollection = dbObject.collection(dbCollectionName);
			console.log("[MongoDB connection] SUCCESS");

			successCallback(dbCollection);
		}
	});
}

module.exports = {
	initialize
};
```

1. The function accepts our cloud db details (db name and collection name) and callbacks.
2. It then connects to our cloud db using the driver method `MongoClient`.
3. Upon success, it calls the `successCallback` passing the `dbCollection` object.
   - Any failure will be thrown by `failureCallback`
4. We'll use `dbCollection` to execute mongodb commands.

5. Back to our server, we'll start `server.js` from scratch. We will be using the cloud db connection instead of `diskdb`.

```javascript
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

// << db init >>

server.listen(port, () => {
	console.log(`Server listening at ${port}`);
});
```

Nothing new here except the `<< db setup >>` part, where we import `db.js` with out `initialize` method and define variables for the db's info.

4. Initialize the database connection.

```javascript
// db.js
...
// << db init >>
db.initialize(dbName, collectionName, function(dbCollection) { // successCallback
    // get all items
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
		  console.log(result);

		  // << return response to client >>
    });

    // << db CRUD routes >>

}, function(err) { // failureCallback
    throw (err);
});
...
```

We use the method we wrote before to initialize the collection, passing db info and a `successCallback`.

Inside this callback:

1. `GET all` using `find()`, which returns a _cursor_.

   - A _cursor_ is like an iterator

2. Convert the cursor to an array using **async** method `toArray(callback)`

   - ...instead of doing `hasNext()` and `next()` repeteadly

3. `callback` runs after successfully converting the cursor to an array

   - We log the result for now, but you can imagine the code for returning response to client goes here

4. Start server

```bash
$ npm install
$ npm start
```

...which should give:

```bash
Server listening at 4000
[MongoDB connection] SUCCESS
[ { _id: 5d7ed8f31c9d4400009c3775,
    id: 'tt0110357',
    name: 'The Lion King',
    genre: 'animation' } ]
```

#### Yay! It works!

![works](https://media.giphy.com/media/hQiyolNu6eF2xvq6zH/giphy.gif)

Now let's complete all the CRUD routes to finish this off.

# CRUD routes

Since this is **MongoDB** after all, most of the API is similar from last lesson's `diskdb` client to the official `MongoClient`

| CRUD Operation | REST operation      | MongoClient Operation                                    |
| -------------- | ------------------- | -------------------------------------------------------- |
| Create         | POST `/items`       | `dbCollection.insertOne(object, callback)`               |
| Read One       | GET `/items/:id`    | `dbCollection.findOne(query callback)`                   |
| Read All       | GET `/items`        | `dbCollection.find(query).toArray(callback)`             |
| Update         | PUT `/items/:id`    | `dbCollection.updateOne(query, { $set: obj }, callback)` |
| Delete         | DELETE `/items/:id` | `dbCollection.deleteOne(query, callback)`                |

All of these routes go in the `<< db CRUD routes >>` marker in our code.

### i. Create ➕

```javascript
// server.js
...
// << db CRUD routes >>
server.post("/items", (req, res) => {
	const item = req.body;
	dbCollection.insertOne(item, (err, result) => {
		if (err) throw err;
		// return updated list
		dbCollection.find().toArray((_err, _res) => {
			if (_err) throw _err;
			res.json(_res);
		});
	});
});
```

Test:

```bash
$ curl -X POST -H "Content-Type: application/json" --data '{"id": "tt0109830", "name": "Forrest
Gump", "genre": "drama"}' http://localhost:4000/items

[{"_id":"5de5c9d01c9d440000482ef0","id":"tt0110357","name":"The Lion King","genre":"animation"},{"_id":"5de7009967aec74a90f88d67","id":"tt0109830","name":"Forrest Gump","genre":"drama"}]
```

### ii. Read one 🕵️

```javascript
server.get("/items/:id", (req, res) => {
	const itemId = req.params.id;

	dbCollection.findOne({ id: itemId }, (err, result) => {
		if (err) throw err;
		// return item
		res.json(result);
	});
});
```

Test:

```bash
$ curl http://localhost:4000/items/tt0109830

{"_id":"5de7009967aec74a90f88d67","id":"tt0109830","name":"Forrest Gump","genre":"drama"}
```

### iii. Read all 🕵️

```javascript
server.get("/items", (req, res) => {
	// return updated list
	dbCollection.find().toArray((_err, _res) => {
		if (_err) throw _err;
		res.json(_res);
	});
});
```

Test:

```bash
$ curl http://localhost:4000/items

[{"_id":"5de5c9d01c9d440000482ef0","id":"tt0110357","name":"The Lion King","genre":"animation"},{"_id":"5de7009967aec74a90f88d67","id":"tt0109830","name":"Forrest Gump","genre":"drama"}]
```

### iv. Update ✏️

```javascript
server.put("/items/:id", (req, res) => {
	const itemId = req.params.id;
	const item = req.body;
	console.log("Editing item: ", itemId, " to be ", item);

	dbCollection.updateOne({ id: itemId }, { $set: item }, function(err, result) {
		if (err) throw err;
		// send back entire updated list, to make sure frontend data is up-to-date
		dbCollection.find().toArray(function(_err, _result) {
			if (_err) throw _err;
			res.json(_result);
		});
	});
});
```

Test:

Maybe you think "The Lion King" is a drama, since well, I won't spoil it. 🤫 🦁

```bash
curl -X PUT -H "Content-Type: application/json" --data '{"genre": "drama"}' http://localhost:4000/items/tt0110357

[{"_id":"5de5c9d01c9d440000482ef0","id":"tt0110357","name":"The Lion King","genre":"drama"},{"_id":"5de7009967aec74a90f88d67","id":"tt0109830","name":"Forrest Gump","genre":"drama"}]
```

### v. Delete ❌

```javascript
server.delete("/items/:id", (req, res) => {
	const itemId = req.params.id;
	console.log("Delete item with id: ", itemId);

	dbCollection.deleteOne({ id: item_id }, function(err, result) {
		if (err) throw err;
		// send back entire updated list after successful request
		dbCollection.find().toArray(function(_err, _result) {
			if (_err) throw _err;
			res.json(_result);
		});
	});
});
```

Test:

```bash
$ curl -X DELETE http://localhost:4000/items/tt0109830

[{"_id":"5de5c9d01c9d440000482ef0","id":"tt0110357","name":"The Lion King","genre":"drama"}]
```

#### Notes

1. We are using callbacks, instead of ES6 Promises, or ES7 async/await...

2. We return all of the items in the response for all CRUD operations, except for GET one

3.
