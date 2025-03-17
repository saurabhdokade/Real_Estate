import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`);
    console.log(
        `MongoDB Connected with DBHOST !! : ${connectionInstance.connection.host}`
      );
  } catch (error) {
    console.log(`MongoDB Connection Faild !! : ${error}`);
    process.exit(1);
  }
};

export default connectDB ;
