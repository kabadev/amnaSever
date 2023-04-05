import mongoose from "mongoose";

const { Schema } = mongoose;

const ParticipantSchema = new Schema(
  {
    uniqueId: {
      type: String,
      required: true,
      unique: true,
    },

    gender: {
      type: String,
      default: "",
    },
    nationality: {
      type: String,
      default: "",
    },
    age: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "",
    },
    isParent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Participant = mongoose.model("Participant", ParticipantSchema);

export default Participant;
