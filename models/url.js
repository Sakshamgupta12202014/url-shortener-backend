import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // this should match your User model name
      required: true,
    },
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
  },
  { timestamps: true }
);

const urlModel = mongoose.model("url", urlSchema);

export default urlModel;

/* puzzle questions 
amazon 250 questions
producer consumer problem in operating system
blind 75
 */
