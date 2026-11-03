const mongoose = require("mongoose");

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const businessSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    slug: { type: String, required: true, unique: true }, // the part after /b/ in the NFC link
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    phone: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    hours: {
      type: [{ _id: false, day: String, time: String }],
      default: () => DAYS.map((day) => ({ day, time: "9:00 AM - 6:00 PM" })),
    },
    services: [{ _id: false, name: String, price: String }],
    links: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      youtube: { type: String, default: "" },
      maps: { type: String, default: "" },
      website: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Business", businessSchema);
