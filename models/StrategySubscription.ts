import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

const strategySubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    strategyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Strategy",
      required: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// add plugin that converts mongoose to json
strategySubscriptionSchema.plugin(toJSON);

// Add a compound index to prevent duplicate subscriptions
strategySubscriptionSchema.index(
  { userId: 1, strategyId: 1 },
  { unique: true },
);

export default mongoose.models.StrategySubscription ||
  mongoose.model("StrategySubscription", strategySubscriptionSchema);
