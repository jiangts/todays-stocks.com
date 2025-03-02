import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const strategySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      default: null, // null for built-in strategies
      ref: "User",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
    },
    visibility: {
      type: String,
      default: "private",
      enum: ["private", "unlisted", "public", "for-sale"],
    },
    // rules: {
    //   type: [String],
    //   default: [],
    // },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// add plugin that converts mongoose to json
strategySchema.plugin(toJSON);

export default mongoose.models.Strategy ||
  mongoose.model("Strategy", strategySchema);
