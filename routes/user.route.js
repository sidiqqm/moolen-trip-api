import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("user berhasil dijalankan");
});

export default router;
