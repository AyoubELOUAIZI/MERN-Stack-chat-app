const express = require('express')
const { chats } = require('./data/data')
const dotenv=require('dotenv');
const connectDB = require('./config/db');
dotenv.config();
const app = express()
const port = process.env.PORT || 4000;
connectDB(); // connect to database atlas
app.use(express.json);//to accept json data
app.get('/', (req, res) => {
    res.send("Hello world")
})


app.get("/api/chat", (req, res) => {
    res.send(chats)
    // res.send("this should send all chats")
})


app.get("/api/chat/:id", (req, res) => {
    console.log("\n\n\n----------------------------------------------------");
    console.log(req.params.id);
    const singlechat=chats.find(c=>c._id==req.params.id);
    console.log(singlechat);
    res.send(singlechat)
})



app.listen(port, () => {
    console.log(` app listening on port ${port}`.yellow.bold)
})