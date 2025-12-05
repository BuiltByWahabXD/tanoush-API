import express from 'express';
import cors from 'cors';
import userRouter from './routes/users.js';
import  errorHandler  from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';

const app = express();


// CORS configuration
app.use(cors({
  origin: "http://localhost:5173", //API Can be assessed using this Address
  credentials: true
}));

// Public health check endpoint
app.get('/api/status', (_, res) => {
  res.json({ status: 'ok' });
});
//Middlewares
app.use(express.json());  // to parse JSON bodies
app.use(cookieParser());  // to parse cookies

//Routes
app.use('/api/users', userRouter);
//Error Handling Middleware
app.use(errorHandler);

export default app;