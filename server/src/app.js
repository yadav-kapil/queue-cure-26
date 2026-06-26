import express from 'express';
import cookieParser from 'cookie-parser';
import ExpressError from './utils/ExpressError.js';
import cors from 'cors'
import userRouter from './routes/user.routes.js';
import sessionRouter from './routes/session.routes.js';
import recRouter from './routes/rec.routes.js';
import doctorRouter from './routes/doctor.routes.js';
import patientRouter from './routes/patient.routes.js';
import formRouter from './routes/form.routes.js';
import blogRouter from './routes/blog.routes.js';
import config from './config/config.js';

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: config.CLIENT_URI,
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.COOKIE_SECRET));

app.use('/api/auth', userRouter);
app.use('/api/session', sessionRouter);
app.use('/api/rec', recRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/patient', patientRouter);
app.use('/api/form', formRouter);
app.use('/form', formRouter);
app.use('/api/blogs', blogRouter);

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