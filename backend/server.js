const express = require('express')
const app = express()
const dotenv=require('dotenv');
app.use(express.json());//to accept json data
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
dotenv.config();
const port = process.env.PORT || 4000;
connectDB(); // connect to database atlas

app.get('/', (req, res) => {
    res.send("Hello the API is runing seccessfully");
})

// This line of code is setting up a middleware for handling requests to 
// the '/api/user' endpoint using the userRoutes variable, 
// which is assumed to contain routing functions.
app.use('/api/user', userRoutes);



app.listen(port, () => {
    console.log(` app listening on port http://localhost:${port}`.yellow.bold)
})