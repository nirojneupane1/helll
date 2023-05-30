//importing the require module
import express from 'express'; 
import dotenv from 'dotenv'; 
import cors from 'cors';
import connectDB from './db.js';
import AuthRoutes from './routes/AuthRoutes.js';
import CourseRoutes from './routes/CourseRoutes.js';

// Loading environment variables from a .env file
dotenv.config();
 
connectDB();


// Creating an instance of the Express application
const app = express(); 
app.use(express.json());
app.use(cors());




app.use('/api/hawa',AuthRoutes);
app.use('/api/hawa',CourseRoutes);

// Getting the port number from the environment variables
const port = process.env.PORT; 
// Starting the server and listening on the specified port
app.listen(port, () => { 
    console.log(`Server is starting at port ${port}`); 
});
