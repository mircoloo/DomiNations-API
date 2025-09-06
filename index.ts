// imports
const mongoose = require('mongoose');
const express = require('express');
const Sentry = require("@sentry/node");
const app = express()
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./OpenAPI.json');
require('dotenv').config();

// constants
const mogooseUri = process.env.MONGOOSE_URI;
const clientOptions = {
    serverApi: {
        version: '1' as const,
        strict: true,
        deprecationErrors: true
    }
};
const port = process.env.PORT || 3000;
Sentry.init({
  dsn: process.env.SENTRY_DSN || "",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});



app.use(function onError(err: any, req: any, res: any, next:any) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});



console.log("Starting Domination API...");
async function run() {
    try {
        if (!mogooseUri) {
            throw new Error("MONGOOSE_URI non definito nelle variabili d'ambiente");
        }
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(mogooseUri, clientOptions);
        if (!mongoose.connection.db) {
            throw new Error("Connessione al database non riuscita");
        }
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Mongoose connected successfully to mongoDB Atlas");
    } finally {
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect();
        console.log("Mongoose disconnected successfully from mongoDB Atlas");
    }
}

// Swagger UI
app.use('/api/v1/Docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/debug-sentry", function mainHandler(req: any, res: any) {
  throw new Error("My first Sentry error!");
});

app.listen(port, () => {
    run().catch(console.dir);
    console.log(`App listening on http://localhost:${port}`)
    console.log(`Swagger UI available on http://localhost:${port}/api/v1/Docs`)
})

Sentry.setupExpressErrorHandler(app);
