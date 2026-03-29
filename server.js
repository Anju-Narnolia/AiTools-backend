require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const toolRoutes = require("./routes/toolRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
const connectDb = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai-tools",
    );
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
  }
};

connectDb();

app.get("/", (req, res) => {
  res.send("Server Running 🚀");
});

// ✅ Correct route usage
app.use("/api/users", userRoutes);
app.use("/api/tools", toolRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
