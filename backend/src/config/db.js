import mongoose from "mongoose";

const connectDB = async () => {
  // Allow explicit MONGO_URI from env, otherwise fall back to local DB `query_db`
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/query_db";

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Log the connected database name so it's easy to verify which DB is in use
    console.log(`MongoDB connected to database: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;