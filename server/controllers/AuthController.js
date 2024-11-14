import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import { renameSync, unlinkSync } from "fs";
const maxAgre = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAgre })
}
export const SignUp = async (req, resp, next) => {
    try {
        const { email, password } = req.body;
        if (!email && !password) {
            return resp.status(401).send("Email and Password is required")
        }
        const user = await User.create({ email, password });
        resp.cookie("jwt", createToken(email, user.id, {
            maxAgre,
            secure: true,
            sameSite: "None",
        }));
        return resp.status(201).json({ user: { id: user.id, email: user.email, profileSetup: user.profileSetup } })
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}
export const Login = async (req, resp, next) => {
    try {
        const { email, password } = req.body;
        if (!email && !password) {
            return resp.status(400).send("Email and Password is required")
        }
        const user = await User.findOne({ email });
        if (!user) {
            return resp.status(404).send("User With the Given Email Not Found")
        }
        const auth = await compare(password, user.password);
        if (!auth) {
            return resp.status(400).send("Password Is Incorrect")
        }
        resp.cookie("jwt", createToken(email, user.id, {
            maxAgre,
            secure: true,
            sameSite: "None",
        }));
        return resp.status(200).json({ user: { id: user.id, email: user.email, profileSetup: user.profileSetup, firstName: user.firstName, lastName: user.lastName, image: user.image, color: user.color } })
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}


export const GetUserInfo = async (req, resp, next) => {
    try {
        const userData = await User.findById(req.userId);

        if (!userData) {
            return resp.status(404).send("User Not Found")
        }

        return resp.status(200).json({ id: userData.id, email: userData.email, profileSetup: userData.profileSetup, firstName: userData.firstName, lastName: userData.lastName, image: userData.image, color: userData.color })
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}

export const UpdateProfile = async (req, resp, next) => {
    try {

        const { firstName, lastName, color } = req.body;
        if (!firstName || !lastName) {
            return resp.status(400).send("First Name, Last Name and Color is required")
        }
        const userData = await User.findByIdAndUpdate(req.userId, {
            firstName, lastName, color, profileSetup: true
        }, { new: true, runValidators: true });



        return resp.status(200).json({ id: userData.id, email: userData.email, profileSetup: userData.profileSetup, firstName: userData.firstName, lastName: userData.lastName, image: userData.image, color: userData.color })
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}
export const AddProfileImg = async (req, resp, next) => {
    try {
        if (!req.file) {
            return resp.status(400).send("File is required");
        }

        const date = Date.now();
        let fileName = "upload/profiles/" + date + req.file.originalname;
        renameSync(req.file.path, fileName)
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            {
                image: fileName,
            }, {
            new: true,
            runValidators: true
        }
        )
        return resp.status(200).json({ image: updatedUser.image, })
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}
export const RemoveImg = async (req, resp, next) => {
    try {

        const { userId } = req;
        const user = await User.findById(userId);
        if (!user) {
            return resp.status(404).send("User not found");
        }
        if (user.image) {
            unlinkSync(user.image)
        }
        user.image = null;
        await user.save();


        return resp.status(200).send("Profile Image Removed Successfully")
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}
export const Logout = async (req, resp, next) => {
    try {
        resp.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
        return resp.status(200).send("Successfully logged out")
    } catch (err) {
        console.log("SignUp Error", err);
        return resp.status(500).send("Internal Server Error");
    }
}