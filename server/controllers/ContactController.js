import mongoose from "mongoose";
import User from "../models/UserModel.js";
import MessageModel from "../models/MessagesModel.js";

export const searchContacts = async (req, resp, next) => {
    try {
        const { searchTerm } = req.body;
        console.log("search", searchTerm)
        if (searchTerm === undefined || searchTerm === null) {
            return resp.status(400).send("Search term is required");
        }
        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
        const regex = new RegExp(sanitizedSearchTerm, "i");
        const contacts = await User.find({
            $and: [
                { _id: { $ne: req.userId } },
                { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }
            ]
        })
        return resp.status(200).json({ contacts });
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}


export const getContactForDM = async (req, resp, next) => {
    try {
        let { userId } = req;
        userId = new mongoose.Types.ObjectId(userId);
        const contacts = await MessageModel.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }],
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { seq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                }
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                },
            },
            {
                $sort: { lastMessageTime: -1 },
            }
        ])
        return resp.status(200).json({ contacts });
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}


export const getAllContacts = async (req, resp, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } }, "firstName lastName _id email",)
        const contacts = users.map((user) => ({
            label: user.firstName ? `${user.firstName} - ${user.lastName}` : user.email,
            value: user._id,
        }))

        return resp.status(200).json({ contacts });
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}