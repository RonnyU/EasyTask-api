import mongoose from 'mongoose';
import config from './config';

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(config.MONGO_URI);

    const url = `${connection.connection.host}:${connection.connection.port}`;

    console.log(`MongoDB is up : ${url}`);
  } catch (error) {
    console.log(`error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDb;
