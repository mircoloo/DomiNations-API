const mongoose = require('mongoose');
require('dotenv').config();

console.log("Starting Domination API...");
const mogooseUri = process.env.MONGOOSE_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
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

run().catch(console.dir);