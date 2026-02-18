import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/fashionhub";
const client = new MongoClient(uri);

let db = null;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("fashionhub");
    console.log("Connected to MongoDB");
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

function getDB() {
  return db;
}

export { connectDB, getDB };
