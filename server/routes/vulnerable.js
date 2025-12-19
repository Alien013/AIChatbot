import express from "express";

const router = express.Router();

/*
 ⚠️ INTENTIONALLY VULNERABLE
 Mirrors CVE-2025-55182 unsafe deserialization trust
*/
router.post("/deserialize", (req, res) => {
  try {
    const serialized = req.body.payload;

    // ❌ Unsafe deserialization
    const data = JSON.parse(serialized);

    // ❌ Dangerous implicit trust
    if (data && data.action) {
      eval(data.action); // LAB PURPOSE ONLY
    }

    res.json({ status: "processed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
