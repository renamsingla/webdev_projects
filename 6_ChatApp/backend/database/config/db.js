import mongoose from "mongoose";
import env from "../../env.js";

export default async () => {
    return await mongoose.connect(env.DB_URL)
}