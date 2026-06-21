import express from 'express';
import cookieParser from 'cookie-parser';
import ExpressError from './utils/ExpressError.js';
import cors from 'cors'
import userRouter from './routes/user.routes.js';
import config from './config/config.js';

const app = express();

// middlewares
app.use(cors({
  origin: config.CLIENT_URI,
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.COOKIE_SECRET));

// routes
app.use('/api/auth', userRouter)

// error handlers
app.use((req, res, next) => {
  throw new ExpressError(404, "Page Not Found");
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({
    success: false,
    message,
  });
});

export default app;