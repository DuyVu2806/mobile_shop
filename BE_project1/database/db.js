import mongoose from "mongoose";

mongoose
  .connect(process.env.DATA_URI)
  .then(() => {
    console.log("Database to the connection.");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
