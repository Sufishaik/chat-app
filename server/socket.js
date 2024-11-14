import { Server as SockerIOServer } from "socket.io"
import MessageModel from "./models/MessagesModel.js";
import { Channel } from "./models/ChannelModel.js";


export const setupSocket = (server) => {
    const io = new SockerIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        }
    });


    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const receipentSocketId = userSocketMap.get(message.recipient);
        const createdMessage = await MessageModel.create(message);

        const messageData = await MessageModel.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .populate("recipient", "id email firstName lastName image color");
        if (receipentSocketId) {
            io.to(receipentSocketId).emit("recieveMessage", messageData);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData);
        }

    }

    const userSocketMap = new Map();
    const disconnect = (socket) => {
        console.log(`client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    }

    const sendChannelMessage = async (message) => {
        const { channelId, sender, content, messageType, fileUrl, } = message;
        const createMsg = await MessageModel.create({
            sender, recipient: null, content, messageType, timestamp: new Date(), fileUrl
        });

        const messageData = await MessageModel.findById(createMsg._id).populate("sender", "id email firstName lastName image color").exec();
        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createMsg._id },
        });
        const channel = await Channel.findById(channelId).populate("members");
        const finalData = { ...messageData._doc, channelId: channel._id };
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if (memberSocketId) {
                    io.to(memberSocketId).emit("recieveChannelMessage", finalData);
                }

            })
            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit("recieveChannelMessage", finalData);
            }
        }
    };

    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log('connection established with user: ', userId);
        } else {
            console.log('connection not established')
        }
        socket.on("sendMessage", sendMessage)
        socket.on("sent-channel-msg", sendChannelMessage)
        socket.on('disconnect', () => disconnect(socket));
    })
}