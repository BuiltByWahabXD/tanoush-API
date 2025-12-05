import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    const connection = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully ", connection.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed :", error.message);
  }
};

export default connectDB;
