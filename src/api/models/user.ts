import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    records: {
      type: [{}],
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
