const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    username: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    fullname: { type: String, require: true },
    avatar: {
      type: String,
      default:
        "https://marketplace.canva.com/EAFltFTo1p0/1/0/400w/canva-cute-anime-illustration-boy-avatar-FHrPI721fpQ.jpg",
    },
    refreshToken: { type: String, default: null },
  },
  { versionKey: false }
);
module.exports = mongoose.model("User", User, "users");
