import express from 'express';
import ExpressError from './utils/ExpressError.js';

const app = express();

app.get('/', (req, res, next) => {
    res.send("hello")
})

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