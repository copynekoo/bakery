import express from "express"
import bodyParser from "body-parser";
import multer from "multer";
import { verifyToken, verifyEmployee } from "../middleware/authMiddleware.js"
import { getOrder, purchase, addPayment, changeStatus, getAllOrders } from "../controllers/orderController.js"
import reformatOrders from "../utils/reformatOrders.js"

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
  const format = req.query.format;
  const username = req.username;
  let order = await getOrder(username);
  if (format === 'true'){
    order = reformatOrders(order);
  }
  res.status(200).json(order);
});

router.post("/purchase", verifyToken, async (req, res) => {
  try {
    const username = req.username;
    const data = req.body;
    const purchased = await purchase(username, data);
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

// Employees Only
router.put('/status', verifyEmployee, async(req, res) => {
  try {
    const order_id = req.body.order_id;
    const status = req.body.status;
    await changeStatus(order_id, status);
    res.status(200).json({
      "status": "success",
      "message": "approval success"
    })
  } catch (err) {
    res.status(500).json({
      "status": "failed",
      "message": "approval failed"
    })
  }
})

router.get('/all', verifyEmployee, async (req, res) => {
  const orders = await getAllOrders();
  res.status(200).json(orders);
});

export default router;