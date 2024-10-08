const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

// middlewares
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzcic.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // collections
    const userCollections = client.db("curaRx").collection("users");
    const prescriptionCollections = client
      .db("curaRx")
      .collection("prescriptions");

    app.get("/", async (req, res) => {
      res.send("CuraRx server is running");
    });

    // ====================== users api's 👥 ========================

    // get all users
    app.get("/users", async (req, res) => {
      const users = await userCollections.find().toArray();
      res.send(users);
    });

    // login api
    app.post("/login", async (req, res) => {
      const userData = req.body;
      const { name, password } = userData;

      // query for email and username both
      const userQuery = {
        $or: [{ email: name }, { username: name }],
      };

      // find user from user collection
      const validUser = await userCollections.findOne(userQuery);

      // error for not valid user
      if (!validUser) {
        return res
          .status(401)
          .send({ message: "User not found with the username or email" });
      }

      // check password
      if (validUser.password === password) {
        return res
          .status(200)
          .send({ message: "Login successfull", validUser });
      } else {
        // handle incorrect password
        return res.status(401).send({ message: "Incorrect password" });
      }
    });

    //======================= prescription releted api's 📃 =========================

    // prescription entry => post
    app.post("/prescription", async (req, res) => {
      const newPrescription = req.body;

      const prescriptionEntry = await prescriptionCollections.insertOne(
        newPrescription
      );
      res.status(200).send(prescriptionEntry);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
