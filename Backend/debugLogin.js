import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "./src/models/users.model.js";

const [email, password, ...extraArgs] = process.argv.slice(2);

if (!process.env.MONGODB_URI || !email || !password || extraArgs.length > 0) {
    console.error("Usage: node debugLogin.js <email> <password>");
    process.exitCode = 1;
} else {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const escapedEmail = email.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const emailPattern = new RegExp(`^\\s*${escapedEmail}\\s*$`, "i");
        const [user, matchingUsers] = await Promise.all([
            userModel.findOne({ email: emailPattern }),
            userModel.countDocuments({ email: emailPattern })
        ]);
        console.log(`matchingUsers: ${matchingUsers}`);

        if (!user) {
            console.log("No user found for that email.");
        } else {
            console.log(`username: ${user.username}`);
            console.log(`email: ${user.email}`);
            console.log(`role: ${user.role}`);
            console.log(`isActive: ${user.isActive}`);
            console.log(`passwordHashPrefix: ${user.password?.slice(0, 7) ?? "(no password)"}`);
            console.log(`passwordMatches: ${user.password ? await bcrypt.compare(password, user.password) : false}`);
        }
    } catch (error) {
        console.error("Unable to inspect login:", error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}
