import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt"
const userSchema = new mongoose.Schema({
    email: {
        type: "string",
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: "string",
        required: [true, "Password is required"],
    },
    firstName: {
        type: "string",
        required: false,
    },
    lastName: {
        type: "string",
        required: false,
    },
    image: {
        type: "string",
        required: false,
    },
    color: {
        type: Number,
        required: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    }
});

userSchema.pre("save", async function (next) {
    const salt = await genSalt()
    this.password = await hash(this.password, salt);

    next();
})

const User = mongoose.model("Users", userSchema);
export default User;