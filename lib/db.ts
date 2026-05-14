import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI ;

if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not defined");
}
interface MongooseCache {
  conn: typeof import("mongoose") | null;
  promise: Promise<typeof import("mongoose")> | null;
}
declare global {
  var mongoose: MongooseCache | undefined;

}
let cached: MongooseCache =global.mongoose ||  { conn: null, promise: null };
if(!global.mongoose){
  global.mongoose = cached;
}
async function dbConnect() {
   if (!MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not defined");
  }
  if (cached.conn) {
    return cached.conn;
  }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
          };
        cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
          return mongoose;
        });
    }
    try {      cached.conn = await cached.promise;
    } catch (error) {
      cached.promise = null;
      throw error;
    }
    return cached.conn;
}
export default dbConnect;
        

