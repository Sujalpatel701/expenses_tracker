const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const User = require("./models/User"); // Import User model
const Bill = require("./models/Bill"); // Import Bill model

const app = express();
app.use(cors());
app.use(express.json());

// **Signup Route**
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log("Signup Request:", { email, password });

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ email, password });
    await newUser.save();
    
    console.log("User Signed Up:", { email, password });
    res.json({ message: "Signup successful", data: { email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// **Login Route**
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login Request:", { email, password });

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User Found:", user);
    res.json({ message: "Login successful", data: { email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// **Add Bill Route**
app.post("/api/add-bill", async (req, res) => {
  try {
    const { name, datetime, desc, email } = req.body;

    if (!name || !datetime || !desc || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBill = new Bill({ name, datetime, desc, email });
    await newBill.save();

    res.status(201).json({ message: "Bill added successfully", data: newBill });
  } catch (error) {
    console.error("Error adding bill:", error);
    res.status(500).json({ message: "Error adding bill", error: error.message });
  }
});

// **Get Bills Route**
app.get("/api/get-bills", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "User email is required" });
    }

    const bills = await Bill.find({ email });

    if (bills.length === 0) {
      return res.status(404).json({ message: "No bills found" });
    }

    res.status(200).json({ message: "Bills retrieved successfully", data: bills });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Bill Tracker API");
});

// **Start Server After DB Connection**
const startServer = async () => {
  await connectDB();

  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
};

startServer();
