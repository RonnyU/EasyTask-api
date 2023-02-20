import express from 'express';
//import dotenv from 'dotenv';
import connectDb from './config/db';
import config from './config/config';

const app = express();
//dotenv.config();
connectDb();
console.log(process.env.MONGO_URI);
app.use(express.json());

const PORT = config.PORT || 4000;

app.get('/ping', (_, res) => {
  console.log('someone pinged here!!');
  res.send('ping');
});

app.listen(PORT, () => {
  console.log(`Server running ON PORT ${PORT}`);
});
