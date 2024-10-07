require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connectDB");
const expenseRoutes = require("./routes/expenseRoutes");
const errorHandler = require("./middleware/errorHandler");
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/expenses", expenseRoutes);

// Error Handling Middleware
app.use(errorHandler);
app.use(express.static("public"));

// Connect to MongoDB and Start Server
const port = process.env.PORT || 3002;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error(error);
  }
};

start();
