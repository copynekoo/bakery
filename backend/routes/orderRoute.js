import express from "express"
import bodyParser from "body-parser";
import { verifyToken } from "../middleware/authMiddleware.js"
import { getOrder, preOrder } from "../controllers/orderController.js"

const router = express.Router();

router.use(bodyParser.json());

router.get('/', verifyToken, async (req, res) => {
  const username = req.username;
  const order = await getOrder(username);
  res.status(200).json(order);
});

router.post("/preOrder", verifyToken, async (req, res) => {
  try {
    const username = req.username;
    const data = req.body;
    const pre_order = await preOrder(username, data);
    res.status(200).json({
      "status": "success",
      "message": "preorder success"
    })

  } catch (erorr) {
    res.status(500).json({
      "status": "failed",
      "message": "preorder failed"
    })
  }
});

export default router;