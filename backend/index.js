const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
require("dotenv").config();
const mongoose = require("mongoose");

// middlewares
app.use(express.json());
app.use(cors());

// mongoose connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzcic.mongodb.net/curaRx?retryWrites=true&w=majority`;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB with Mongoose"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// ====================== Mongoose Schema ========================

// User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: function (v) {
        // Email validation regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

// Prescription schema
const prescriptionSchema = new mongoose.Schema({
  prescriptionDate: {
    type: Date,
    default: () => new Date().toLocaleString(),
  },
  patientName: {
    type: String,
    required: [true, "Patient name is required"],
  },
  patientAge: {
    type: Number,
    required: [true, "Patient Age is required"],
    min: [1, "Age must be at least 1"],
    max: [100, "Age cannot be greater than 100"],
  },
  patientGender: {
    type: String,
    required: [true, "Gender is required"],
  },
  diagnosis: {
    type: String,
  },
  medicines: {
    type: String,
  },
  nextVisitDate: {
    type: Date,
    validate: {
      validator: function (value) {
        if (value) return value > new Date();
      },
      message: "Next visit date must be a future date",
    },
  },
});

// Create mongoose models
const User = mongoose.model("User", userSchema);
const Prescription = mongoose.model("Prescription", prescriptionSchema);

// ====================== API Routes ========================

app.get("/", (req, res) => {
  res.send("CuraRx server is running");
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Error fetching users", error });
  }
});

// Login API
app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    // query for email or username
    const userQuery = {
      $or: [{ email: name }, { username: name }],
    };

    // find user from User collection
    const validUser = await User.findOne(userQuery);

    // error for not valid user
    if (!validUser) {
      return res
        .status(401)
        .send({ message: "User not found with the username or email" });
    }

    // check password
    if (validUser.password === password) {
      return res.status(200).send({ message: "Login successful", validUser });
    } else {
      // handle incorrect password
      return res.status(401).send({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error during login", error });
  }
});

// Prescription entry API
app.post("/prescription", async (req, res) => {
  try {
    const newPrescription = req.body;
    const prescriptionEntry = await Prescription.create(newPrescription);
    res.status(200).send(prescriptionEntry);
  } catch (error) {
    if (error.name === "ValidationError") {
      // validation errors
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res
        .status(400)
        .send({ message: "Validation errors", errors: validationErrors });
    } else {
      // Handle other types of errors
      res.status(500).send({ message: "Error creating prescription", error });
    }
  }
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
