const cors = require("cors");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");

const port = 45 || process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
// var count = 0;
// const hostname = '0.0.0.0'
const groupUsers = [{}]; 

app.use(cors());
app.use("/", (req, res) => {
    res.send("hello");
})

io.on("connection", (socket) => {
    // console.log("new Connection");
    socket.on("joined", ({ user }) => {
        // count++;
        groupUsers[socket.id] = user;
        // console.log(`${user} has Joined`);
        socket.broadcast.emit("UserJoined", { user: "Admin", message: `${groupUsers[socket.id]} Has Joined` });
        socket.emit('send', { user: "Admin", message: `Welcome To The Chat, ${groupUsers[socket.id]}` });
        // socket.emit('TotalNo', { totalUsers: `${count}` })
    }); 
    socket.on('message', ({ message, id }) => {
        io.emit('sendMsg', { user: groupUsers[id], message, id })
    })

    socket.on("disconnect", () => {
        // count--;
        socket.broadcast.emit("leave", { user: "Admin", message: `${groupUsers[socket.id]} Has Left` })
        // console.log('User Left');
        // socket.emit('TotalNo', { totalUsers: `${count}` })
    });
})

server.listen(port, () => {
    console.log(`app listening on port ${port}`)
})