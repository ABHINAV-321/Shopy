
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://abhi:hacker.abhi@cluster0.rfzif0y.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

module.exports.connect = async function () {
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("shopping").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
   // console.log(client.db("shopping").collection("product"))
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}//.catch(console.dir);
