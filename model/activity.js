import mongoose from "mongoose";
const { Schema } = mongoose;

const ActivitySchema = new Schema(
  {
    activityName: {
      type: String,
      required: true,
      unique: true,
    },
    activityType: {
      type: String,
      default: "",
    },
    county: {
      type: String,
      default: "",
    },

    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: null,
    },
    participants: {
      type: Array,
      default: [],
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", ActivitySchema);

export default Activity;
