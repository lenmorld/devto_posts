# REST API with MongoDB Atlas + Node + Express

### Code for the dev.to article

https://dev.to/lenmorld/rest-api-with-mongodb-atlas-cloud-node-and-express-in-10-minutes-2ii1

### Common MongoDB errors and solutions:

- **`MongoParseError: Invalid connection string`**

> Make sure you have copied the connection string from MongoDB Atlas cloud, and supplied your username and password. It should a bit like this:

`mongodb+srv://myusername:mypassword@cluster0-somelocation.mongodb.net/test?retryWrites=true&w=majority`

- **`MongoNetworkError: failed to connect to server [...] on first connect [connection to ... closed]`**

> This is most likely a **IP Whitelist error**. Make sure you have added your current IP address to the IP Whitelist in Mongo DB atlas.

### Enjoy coding 🤓😆
