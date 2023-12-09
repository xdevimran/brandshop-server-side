const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iitamdp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("b8a10").collection("products");
    const userCollection = client.db("b8a10").collection("users");
    const orderCollection = client.db("b8a10").collection("orders");

    // POST a new product
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
      console.log(product);
    });

    // POST a new order
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
      console.log(order);
    });

    // GET all orders
    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // GET all products
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    // Get a single product based on id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.json(product);
      console.log(query);
    });

    // Get Single order based on id
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const product = await orderCollection.findOne(query);
      res.json(product);
      console.log(query);
    });

    // Get products based on brand
    app.get("/products/brand/:brand", async (req, res) => {
      const query = { brand: req.params.brand };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
      console.log(query);
    });

    // Update a product
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const product = {
        $set: {
          name: updatedProduct.name,
          price: updatedProduct.price,
          brand: updatedProduct.brand,
          category: updatedProduct.category,
          description: updatedProduct.description,
          image: updatedProduct.image,
          rating: updatedProduct.rating,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.json(result);
    });

    // User Registration
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
      console.log(user);
    });

    // ddddddddddddddddd
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
