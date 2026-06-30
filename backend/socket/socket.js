import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {}; // this map stores socket id corresponding to the user id: userId -> socketId

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User connected: UserId = ${userId}, SocketId = ${socket.id}`);
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        if (userId) {
            delete userSocketMap[userId];
            console.log(`User disconnected: UserId = ${userId}, SocketId = ${socket.id}`);
        }
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, io, server };
