import express from "express"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  res.status(200).json({username: req.username});
});

export default router;