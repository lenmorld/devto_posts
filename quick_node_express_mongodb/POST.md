---
title: 🌱 REST API with MongoDB Atlas cloud, Node, and Express in 10 minutes
published: true
description: Connect to Mongo DB cloud with Node and Express in 10 minutes
tags: #node, #express, #database, #nosql
cover_image: https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg
series: Building Node and Express Stuff in 5 minutes
---

Let's bring the data to the cloud this time! 💾 ☁.
And what better way to do that than a **FREE** cloud database! 
We'll be using the free cluster of **Mongo DB Atlas**.

## What is Mongo DB Atlas?

> Mongo DB Atlas is a fully-managed database-as-a-service available on AWS, Azure, and GCP

Before Atlas, I used **mLab**. mLab was then acquired by MongoDB last year. Pretty much similar to mLab, MongoDB Atlas is the easiest way to have a cloud MongoDB instance.

**Why?**

- 💲 **0 dollars**: I am not an advertiser for MongoDB, but I love this service and this one won't break the bank ❌🔨🐖, since... well it's no-strings-attached FREE for up to 512MB. Perfect for small side-projects!

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

  - ❗ Remember to do this step again when you switch WiFi, e.g. when moving from coffee shop to home WiFi.

	* 💡 If you are in a public wi-fi, you can use a service like https://whatismyipaddress.com/ to get your IPv4 public address, since `ipconfig` or `ifconfig` might not give you only the internal network address.

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

**Now we're ready to dive into code!**

![Dive](https://media.giphy.com/media/5zkZRNNb7WW8B9iN3Q/giphy.gif)

# Connecting to the db

### 1. Grab the starter code from last lesson here:

https://github.com/lenmorld/devto_posts/tree/master/quick_node_express_diskdb

2. Install `mongodb` driver

```bash
$ npm install mongodb
```

### 2. Create a new file called `db.js` in the app root.

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

### Back to our server, we'll start `server.js` from scratch.

We will be using the cloud db connection instead of `diskdb`.

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

In `<< db setup >>`, we import `db.js` (to use our `initialize` method), and define variables for the db's info.

### 4. Initialize the database connection.

```javascript
// db.js
...
// << db init >>
db.initialize(dbName, collectionName, function(dbCollection) { // successCallback
    // get all items
    dbCollection.find().toArray(function(err, result) {
        if (err) throw err;
		  console.log(result);
    });

    // << db CRUD routes >>

}, function(err) { // failureCallback
    throw (err);
});
...
```

We `initialize` the db with the `dbName`, `collectionName`, and a `successCallback`.

Inside the `successCallback`:

1. `GET all` using `collection.find()`, which returns a _cursor_.

   - A _cursor_ is like an iterator, where you can do `next`, `hasNext()`, etc

2. Convert the cursor to an array using **async** method `toArray(callback)`

   - It's simpler for our use case to return full array, than iterate the cursor.

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

**Now let's complete all the CRUD routes!**

# CRUD routes

Here's a rundown of the CRUD-to-MongoDB operations for our route handlers.

_Notice that there are quite some syntax differences between `diskdb` functions and the official `MongoClient`._

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
```

1. For the `POST /items` handler, use `insertOne(item, callback)` to add the movie from `request.body` (parsed by `body_parser` middleware)

2. In the `callback` of `insertOne`, throw the `error` if any. The `result` is not used here (\_which is just a boolean for success and `_id` of inserted document).

3. Get the updated list using `find()`, and return the `_result` as the response in its `callback`.

> Note the two levels of similar callbacks here: outer callback of `insertOne`, and inner one of `find`. This is why I used `(_error, _result)` in the inner to avoid name collision. But feel free to rename them 😉

Test:

```bash
$ curl -X POST -H "Content-Type: application/json" --data '{"id": "tt0109830", "name": "Forrest
Gump", "genre": "drama"}' http://localhost:4000/items

[{"_id":"5de5c9d01c9d440000482ef0","id":"tt0110357","name":"The Lion King","genre":"animation"},{"_id":"5de7009967aec74a90f88d67","id":"tt0109830","name":"Forrest Gump","genre":"drama"}]
```

### ii. Read one 🕵️

```javascript
server.get("/items/:id", (request, response) => {
	const itemId = request.params.id;

	dbCollection.findOne({ id: itemId }, (error, result) => {
		if (error) throw error;
		// return item
		response.json(result);
	});
});
```

1. Get the `id` directly from the params (e.g. `1234` for http://localhost/items/1234).

2. Find the item with that `id` using `findOne(query)`.

> `query` is just an object so you can use key-value pairs for your queries. We use this query object for `find`, `delete` and other MongoDB commands.

```javascript
// query can be:

{ id: 1 }; // find using id

{ name: "The Lion King" }; // find using name

{ id: 1, name: "The Lion King", genre: "action" }; // find using id, name and genre
```

3. Return the item in the `response`

Test:

```bash
$ curl http://localhost:4000/items/tt0109830

{"_id":"5de7009967aec74a90f88d67","id":"tt0109830","name":"Forrest Gump","genre":"drama"}
```

### iii. Read all 🕵️

```javascript
server.get("/items", (request, response) => {
	// return updated list
	dbCollection.find().toArray((error, result) => {
		if (error) throw error;
		response.json(result);
	});
});
```

Return all the items in the collection in the response, same in **POST /items**

Test:

```bash
$ curl http://localhost:4000/items

[{"_id":"5de5c9d01c9d440000482ef0","id":"tt0110357","name":"The Lion King","genre":"animation"},{"_id":"5de7009967aec74a90f88d67","id":"tt0109830","name":"Forrest Gump","genre":"drama"}]
```

### iv. Update ✏️

```javascript
server.put("/items/:id", (request, response) => {
	const itemId = request.params.id;
	const item = request.body;
	console.log("Editing item: ", itemId, " to be ", item);

	dbCollection.updateOne({ id: itemId }, { $set: item }, (error, result) => {
		if (error) throw error;
		// send back entire updated list, to make sure frontend data is up-to-date
		dbCollection.find().toArray(function(_error, _result) {
			if (_error) throw _error;
			response.json(_result);
		});
	});
});
```

1. Get the `id` from params and the `item` from body (through `body-parser`).

2. Update item with `id` and set it to `item`, using `dbCollection.updateOne(query, { $set: item }, callback`.

   - Note the use of MongoDB-specific `{ $set: item }`

3. Return the updated list, as in `POST /items` and `GET /items`

Test:

Maybe you think "The Lion King" is a drama, since ...well, I won't spoil it. 🤫 🦁

```bash
curl -X PUT -H "Content-Type: application/json" --data '{"genre": "drama"}' http://localhost:4000/items/tt0110357

[{"_id":"5de5c9d01c9d440000482ef0","id":"tt0110357","name":"The Lion King","genre":"drama"},{"_id":"5de7009967aec74a90f88d67","id":"tt0109830","name":"Forrest Gump","genre":"drama"}]
```

// TODO

### v. Delete ❌

```javascript
server.delete("/items/:id", (request, response) => {
	const itemId = request.params.id;
	console.log("Delete item with id: ", itemId);

	dbCollection.deleteOne({ id: itemId }, function(error, result) {
		if (error) throw error;
		// send back entire updated list after successful request
		dbCollection.find().toArray(function(_error, _result) {
			if (_error) throw _error;
			response.json(_result);
		});
	});
});
```

Here, only the `id` is needed from params, which we pass to `dbCollection.deleteOne(query)`.

As before, you can formulate a query easily to your needs, since it's just an object.

> 🤸‍♀️ Challenge: modularize the `dbCollection.find()` since we're using it in 3 places.

Test:

```bash
$ curl -X DELETE http://localhost:4000/items/tt0109830

[{"_id":"5de5c9d01c9d440000482ef0","id":"tt0110357","name":"The Lion King","genre":"drama"}]
```

#### Notes

1. **Callbacks ??!!**, why this instead of ES6 Promises, or ES7 async/await...

   - `MongoClient.connect` only supports callbacks, but we'll _promisify_ (and _aysnc-await-ify_) these callbacks on the next lesson, since honestly they are starting to look like **callback hell**. See this post for a fun rundown on **callback hell**.

{% link https://dev.to/amberjones/how-to-escape-callback-hell-with-javascipt-promises-42d0 %}

2. Why do We return all of the items in the response **create, update, delete** ?

   - There are a lot of options on what to do to synchronize UI and backend after a change, and it is quite a _Software Architecture_ topic for itself.

{% link https://dev.to/lenmorld/what-is-the-standard-way-to-keep-ui-state-and-backend-state-synced-during-updates-react-and-node-plm %}

- Here, we just return the updated items to UI after a create, update and delete. We let the frontend (e.g. React, Vue, Angular, Vanilla JS) update its state and views from that information.

### Here's the complete Code

[Quick REST API with Node + Express + MongoDB Atlas](https://github.com/lenmorld/devto_posts/tree/master/quick_node_express_mongodb)

![hackerman](https://media.giphy.com/media/gGuOldphm6vzW/source.gif)

## _"Okay, that was nice. But what can I do with this? "_

✅ Serving HTML files
✅ REST API
✅ Cloud Database persistence

Now, this is an actual server for a small project. Add more routes, save some data in the db through API requests. Just add frontend!™

## Next up:

(In progress)

- **MongoDB callbacks to Promises and Async/Await**

Happy server-ing! 🤓

---

Now, all this Mongo talk made me hungry.
I'm gonna have some of my favorite "Hopia Mongo" 🌱 and make some Mongo with rice. 🍚

![Hopia Mongo](https://www.foxyfolksy.com/wp-content/uploads/2016/03/hopia-recipe-1.jpg)

_Photo from FoxyFolksy in article "Hopia Recipe- Munggo And Ube Filling" src: https://www.foxyfolksy.com/hopia-recipe-munggo-ube-filling/_
