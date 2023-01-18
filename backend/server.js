const express = require('express')
const { chats } = require('./data/data')
const app = express()
const port = 5000

app.get('/', (req, res) => {
    res.send(chats)
})


app.get("/api/chat", (req, res) => {
    res.send(chats)
})


app.get("/api/chat/:id", (req, res) => {
    console.log("\n\n\n----------------------------------------------------");
    console.log(req.params.id);
    const singlechat=chats.find(c=>c._id==req.params.id);
    console.log(singlechat);
    res.send(singlechat)
})




app.listen(port, () => {
    console.log(` app listening on port ${port}`)
})