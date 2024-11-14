import Router from 'express';
import { verifyToken } from "../middlewares/AuthMiddleware.js"
import { getAllContacts, getContactForDM, searchContacts } from '../controllers/ContactController.js';

export const contactRoutes = Router();
contactRoutes.post("/searchTerm", verifyToken, searchContacts);
contactRoutes.get("/getContactsForDM", verifyToken, getContactForDM);
contactRoutes.get("/getALlContacts", verifyToken, getAllContacts);