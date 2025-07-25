// imports
const mongoose = require('mongoose');
const express = require('express');
const app = express()
require('dotenv').config();

// constants
const mogooseUri = process.env.MONGOOSE_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const port = process.env.PORT || 3000;

console.log("Starting Domination API...");
async function run() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(mogooseUri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Mongoose connected successfully to mongoDB Atlas");
    } finally {
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
        console.log("Mongoose disconnected successfully from mongoDB Atlas");
    }
}
app.listen(port, () => {
    run().catch(console.dir);
    console.log(`Example app listening on port http://localhost:${port}`)
})

