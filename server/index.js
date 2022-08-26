const express = require("express");
const http = require("http");
const bodyParser = require('body-parser')
const cors = require('cors');
const socketIo = require("socket.io");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/gnani', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));



const port = process.env.PORT || 4001;
const routes = require("./routes/index");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(routes);

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });


const events = require('./events');
io.on(events.CONNECTION, (socket) => {
    console.log("New client connected");

    socket.on(events.DISCONNECT, () => {
        console.log("Client disconnected");
    });

    socket.on(events.UPDATE, (data) => {
        console.log(data)
        io.emit(events.BROADCAST, data);
    })
});



server.listen(port, () => console.log(`Listening on port ${port}`));
