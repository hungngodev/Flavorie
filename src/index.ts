import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

dotenv.config();
const app = express();

// public
const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(path.resolve(__dirname, './client/dist')));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
});


const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL ?? '');
  app.listen(port, () => {
    console.log(`server running on PORT ${port}...`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
