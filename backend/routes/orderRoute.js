import express from "express"
import bodyParser from "body-parser";
import { verifyToken } from "../middleware/authMiddleware.js"
import { getOrder } from "../controllers/orderController.js"

const router = express.Router();

router.use(bodyParser.json());

router.get('/', verifyToken, async (req, res) => {
  const username = req.username;
  const order = await getOrder(username);
  res.status(200).json(order);
});

export default router;