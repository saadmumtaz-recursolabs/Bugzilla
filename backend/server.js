const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./server/config/db");
const projectRoutes = require("./server/routes/projectRoutes");
const authRoutes = require("./server/routes/authRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
