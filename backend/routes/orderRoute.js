import express from "express"
import bodyParser from "body-parser";
import multer from "multer";
import { verifyToken } from "../middleware/authMiddleware.js"
import { getOrder, preOrder, addPayment } from "../controllers/orderController.js"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/uploads")
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)
  }
})

const upload = multer({
  storage: storage
})

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

router.post('/payment', verifyToken, upload.single('file'), (req, res) => {
  const fileName = req.file.filename;
  const username = req.username;
  const orderId = req.get('order_id');
  addPayment(username, orderId, fileName);
})

export default router;