import express from 'express';
import mongoose from 'mongoose';
import router from './routes';

const app = express();

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/myDatabase', {
    dbName: 'node-typescript-app',
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Middleware
app.use(express.json());

// Routes
app.use('/', router);

// Start server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
