import mongoose from "mongoose";
import { Channel } from "../models/ChannelModel.js";
import User from "../models/UserModel.js";

export const createChannel = async (req, resp, next) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;
        const admin = await User.findById(userId);
        if (!name || !members || !admin) {
            return resp.status(400).send("Name and Members are required");
        }
        if (!admin) {
            return resp.status(400).send("Admin user not found");
        }
        const validMember = await User.find({ _id: { $in: members } });
        if (validMember.length !== members.length) {
            return resp.status(400).send("Some members are not valid");
        }
        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });
        await newChannel.save();
        return resp.status(200).json({ channel: newChannel });
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}

export const getUserChannels = async (req, resp, next) => {
    try {

        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }]
        }).sort({ updatedAt: -1 })

        return resp.status(200).json({ channels });
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}
export const getChannelsMessages = async (req, resp, next) => {
    try {
        const { channelId } = req.params;
        console.log("id")
        const channel = await Channel.findById(channelId).populate({ path: "messages", populate: { path: "sender", select: "firstName lastName email _id image color" } });
        if (!channel) {

            return resp.status(404).send("channel not found");
        }
        const messages = channel.messages
        return resp.status(200).json({ messages });
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}