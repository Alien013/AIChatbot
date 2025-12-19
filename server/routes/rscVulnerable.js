import express from "express";
const router = express.Router();

router.post("/rsc", (req, res) => {
  const { rscPayload } = req.body;

  const obj = JSON.parse(rscPayload);

  if (obj.__rsc_action) {
    Function(obj.__rsc_action)(); // 🔥 vulnerable line
  }

  res.json({ status: "processed" });
});

export default router;
