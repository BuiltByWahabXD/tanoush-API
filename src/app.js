import express from 'express';
import cors from 'cors';
import userRouter from './routes/users.js';
import productRouter from './routes/products.js';
import wishlistRouter from './routes/wishlist.js';
import uploadRouter from './routes/upload.js';
import  errorHandler  from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';

const app = express();


// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], //API Can be accessed using these addresses
  credentials: true
}));

// Public health check endpoint
app.get('/api/status', (_, res) => {
  res.json({ status: 'ok' });
});
//Middlewares
app.use(express.json({ limit: '50mb' }));  // to parse JSON bodies with increased limit for base64 images
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // to parse URL-encoded bodies
app.use(cookieParser());  // to parse cookies

//Routes
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/upload', uploadRouter);
//Error Handling Middleware
app.use(errorHandler);

export default app;