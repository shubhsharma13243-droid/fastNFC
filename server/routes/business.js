const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const wrap = require("../middleware/wrap");
const Business = require("../models/Business");

const uploadDir = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
  fileFilter: (req, file, cb) => cb(null, /^image\/(png|jpe?g|webp)$/.test(file.mimetype)),
});

router.use(auth); // every route below needs a logged-in owner

router.get(
  "/me",
  wrap(async (req, res) => {
    const business = await Business.findOne({ owner: req.userId });
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.json(business);
  })
);

// Only these fields can be changed from the dashboard (slug and owner stay fixed)
const EDITABLE = ["name", "description", "phone", "hours", "services", "links"];

router.put(
  "/me",
  wrap(async (req, res) => {
    const update = {};
    EDITABLE.forEach((f) => {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    });
    const business = await Business.findOneAndUpdate({ owner: req.userId }, update, {
      new: true,
      runValidators: true,
    });
    res.json(business);
  })
);

router.post(
  "/me/images",
  upload.fields([{ name: "logo", maxCount: 1 }, { name: "cover", maxCount: 1 }]),
  wrap(async (req, res) => {
    const update = {};
    if (req.files?.logo) update.logoUrl = `/uploads/${req.files.logo[0].filename}`;
    if (req.files?.cover) update.coverUrl = `/uploads/${req.files.cover[0].filename}`;
    if (!Object.keys(update).length)
      return res.status(400).json({ message: "Upload a PNG, JPG or WebP image under 3 MB" });
    const business = await Business.findOneAndUpdate({ owner: req.userId }, update, { new: true });
    res.json(business);
  })
);

module.exports = router;
