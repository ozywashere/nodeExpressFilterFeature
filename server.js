import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import colors from 'colors';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import 'express-async-errors';
import productRoutes from './routes/productRoutes.js';
//
import connectDB from './config/connectDB.js';
dotenv.config({ path: './.env' });
const app = express();
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(cors());
//routes

app.get('/', (req, res) => {
  res.send('Hello From Express');
});
app.use('/api/v1/products', productRoutes);
//server

//error handling
app.all('*', (req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`.yellow.bold);
});
