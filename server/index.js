import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"
import mongoose from "mongoose";

import authRoutes from "./routes/AuthRoutes.js";
import { contactRoutes } from "./routes/ContactRoutes.js";
import { setupSocket } from "./socket.js";
import messageRoutes from "./routes/MessagesRoute.js";
import { channelRoute } from "./routes/channelRoutes.js";

dotenv.config();
// All the enviornment vaialbles are stored in process.env

const app = express();
app.use("/upload/profiles", express.static("upload/profiles"))
app.use("/upload/files", express.static("upload/files"))
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;
mongoose.connect(databaseURL).then(() => console.log('Connected to database SuccessFull')).catch((err) => console.log("Databse Error: " + err));
app.use(cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
}))

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoute)
const server = app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
})

setupSocket(server)