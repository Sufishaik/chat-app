import MessageModel from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";
export const getMessages = async (req, resp, next) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;

        if (!user1 || !user2) {
            return resp.status(400).send("Both user id are required");
        }

        const messages = await MessageModel.find({
            $or: [
                {
                    sender: user1, recipient: user2,
                },
                {
                    sender: user2, recipient: user1,
                },
            ]
        }).sort({ timestamp: 1 })
        return resp.status(200).json({ messages });
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}
export const uploadFile = async (req, resp, next) => {
    try {
        if (!req.file) {
            return resp.status(400).send("File is required");
        }
        const date = Date.now();
        let fileDir = `upload/files/${date}`;
        let fileName = `${fileDir}/${req.file.originalname}`;
        mkdirSync(fileDir, { recursive: true });
        renameSync(req.file.path, fileName)
        return resp.status(200).json({ filePath: fileName });
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}