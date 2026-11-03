const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Business = require("../models/Business");
const wrap = require("../middleware/wrap");

const sign = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// "Sharma Sweets" -> "sharma-sweets", adds -2, -3 ... if already taken
async function uniqueSlug(name) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "business";
  let slug = base;
  let n = 1;
  while (await Business.exists({ slug })) slug = `${base}-${++n}`;
  return slug;
}

router.post(
  "/signup",
  wrap(async (req, res) => {
    const { email, password, businessName } = req.body;
    if (!email || !password || !businessName)
      return res.status(400).json({ message: "Business name, email and password are required" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    if (await User.exists({ email: email.toLowerCase().trim() }))
      return res.status(409).json({ message: "This email is already registered" });

    const user = await User.create({ email, passwordHash: await bcrypt.hash(password, 10) });
    await Business.create({ owner: user._id, name: businessName, slug: await uniqueSlug(businessName) });
    res.status(201).json({ token: sign(user) });
  })
);

router.post(
  "/login",
  wrap(async (req, res) => {
    const { email = "", password = "" } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ message: "Email or password is incorrect" });
    res.json({ token: sign(user) });
  })
);

module.exports = router;
