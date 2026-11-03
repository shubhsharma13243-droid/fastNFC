const router = require("express").Router();
const wrap = require("../middleware/wrap");
const Business = require("../models/Business");

// No login needed: this is what a customer sees after tapping the NFC tag
router.get(
  "/:slug",
  wrap(async (req, res) => {
    const business = await Business.findOne({ slug: req.params.slug }).select(
      "-owner -createdAt -updatedAt -__v"
    );
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.json(business);
  })
);

module.exports = router;
