// /database/mongoose.ts
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) throw new Error("⚠️  MONGODB_URI missing");

interface ConnCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// next-js hot-reload safe cache ⬇️
let cached = (global as any)._mongoose as ConnCache | undefined;
if (!cached) {
  cached = (global as any)._mongoose = { conn: null, promise: null };
}

export const dbConnect = async (): Promise<Mongoose> => {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    cached!.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB, // اختياري
      })
      .then((m) => {
        console.log("📦 MongoDB connected");
        return m;
      })
      .catch((e) => {
        console.error("❌ MongoDB connection error", e);
        throw e;
      });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
};

// import mongoose, {Mongoose} from 'mongoose'

// const MONGODB_URI = process.env.MONGODB_URI as string;

// if(!MONGODB_URI){
//     throw new Error("MONGODB_URI is not defined");
// }

// interface MongooseCache {
//     conn: Mongoose | null;
//     promise: Promise<Mongoose> | null;
// }

// declare global {
// var mongoose: MongooseCache;
// }

// let cached = global.mongoose;

// if(!cached) {
//     cached = global.mongoose = { conn: null, promise: null}
// }

// const dbConnect = async (): Promise<Mongoose> => {
//     if(cached.conn) {
//         return cached.conn;
//     }
//     if(!cached.promise){
//         cached.promise = mogoose.connect(MONGODB_URI, {
//             dbName: 'Cluster0'
//         }).then((result) => {
//             console.log("Connected To MongoDB");
//             return result;
//         }).catch((error) => {
//             console.log("Error Connecting To MongoDB", error);
//             throw error;
//         });
//     }
//     cached.conn = await cached.promise;
//     return cached.conn
// }

// export default dbConnect