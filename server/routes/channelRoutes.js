import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { createChannel, getChannelsMessages, getUserChannels } from "../controllers/ChannelControllers.js";


export const channelRoute = Router();
channelRoute.post('/createChannel', verifyToken, createChannel);
channelRoute.get('/getUserChannel', verifyToken, getUserChannels);
channelRoute.get('/getChannelMessages/:channelId', verifyToken, getChannelsMessages);