import mongoose from "mongoose";

const savedComponentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    code: { type: String, required: true },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("SavedComponent", savedComponentSchema);
