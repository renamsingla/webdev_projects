import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  image: { type: Buffer, required: true }, // stores actual file
  contentType:{ type: String, required: true }, // e.g., 'image/png'
  expiresAt: {
    type: Date,
    default: () => Date.now() + 24*60*60*1000 // expires in 24 hours
  }
}, { timestamps: true });

// TTL index created here:
StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story= mongoose.model("Story", StorySchema)
export default Story;