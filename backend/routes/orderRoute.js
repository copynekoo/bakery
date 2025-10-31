import express from "express"
import bodyParser from "body-parser";
import multer from "multer";
import fs from "fs";
import path from "path";
import { verifyToken, verifyEmployee } from "../middleware/authMiddleware.js"
import { getOrder, purchase, addPayment, changeStatus, getStatus, getAllOrders, cancelOrder } from "../controllers/orderController.js"
import { isProductOnSale } from "../controllers/productItemController.js"
import { reformatOrders, reformatAllOrders } from "../utils/reformatOrders.js"

const uploadDir = path.join(process.cwd(), "public", "uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir(uploadDir, { recursive: true }, (mkdirError) => {
      if (mkdirError) {
        return cb(mkdirError);
      }
      cb(null, uploadDir);
    });
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
  // Parameters
  const format = req.query.format;
  const sort_by_time = req.query.sort_by_time;
  const sort_by_status = req.query.sort_by_status;
  //
  const username = req.username;
  try { 
    let order = await getOrder(username, sort_by_time, sort_by_status);
    if (format === 'true'){
      order = reformatOrders(order);
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(401).json({"error": "Unable to fetch account"});
  }
});

router.put('/', verifyToken, async(req, res) => {
  try {
    const order_id = req.body.order_id;
    const username = req.username;
    const valid = await cancelOrder(username, order_id);
    if (valid === false) { throw Error("Not valid") }
    res.status(200).json({
      "status": "success",
      "message": "cancel order success"
    })
  } catch (err) {
    res.status(500).json({
      "status": "failed",
      "message": "cancel order unvalid"
    })
  }
})

router.post("/purchase", verifyToken, async (req, res) => {
  try {
    const username = req.username;
    const data = req.body;
    const order_lines = data[0].order_lines;
    const shippingdestination = data[0].shippingdestination;
    if (!shippingdestination.trim()){
      throw new Error("No shipping destination specified");
    }
    for (const orderKey in order_lines) {
      const order = order_lines[orderKey];
      const product_id = order.product_id;
      const isProductIdOnSale = await isProductOnSale(product_id)
      if (isProductIdOnSale === false) throw new Error("Invalid product ID");
      const quantity = order.quantity;
      if (quantity <= 0){
        throw new Error("0 is not permitted")
      }
    }
    const purchased = await purchase(username, data);
    res.status(200).json({
      "status": "success",
      "message": "preorder success"
    })

  } catch (erorr) {
    res.status(500).json({
      "status": "failed",
      "message": "preorder failed",
    })
  }
});

router.post('/payment', verifyToken, upload.single('file'), (req, res) => {
  try {
    const uploadedFileName = req.file.filename;
    const username = req.username;
    const orderId = req.get('order_id');
    addPayment(username, orderId, uploadedFileName);
    res.status(200).json({
      "status": "success",
      "message": "File is uploaded",
      "uploadedFileName": uploadedFileName
    })
  } catch (err) {
    res.status(500).json({
      "status": "failed",
      "message": "File upload failed",
    })
  }
})

// Employees Only
router.get('/status', verifyEmployee, async(req, res) => {
  try {
    const order_id = req.body.order_id;
    const get_status = await getStatus(order_id);
    res.status(200).json({
      "status": "get status success",
      "return_status": get_status
    })
  } catch (err) {
    res.status(500).json({
      "status": "failed",
      "message": "get status failed"
    })
  }
})

router.put('/status', verifyEmployee, async(req, res) => {
  try {
    const order_id = req.body.order_id;
    const status = req.body.status;
    const tracking_number = req.body.tracking_number;
    const valid = await changeStatus(order_id, status, tracking_number);
    if (valid === false) { throw Error("Not valid") }
    res.status(200).json({
      "status": "success",
      "message": "change status success"
    })
  } catch (err) {
    res.status(500).json({
      "status": "failed",
      "message": "change status unvalid"
    })
  }
})

router.get('/all', verifyEmployee, async (req, res) => {
  try {
    // Parameters
    const format = req.query.format;
    const sort_by_time = req.query.sort_by_time;
    const sort_by_status = req.query.sort_by_status;
    const search = req.query.search || "";
    //
    let orders = await getAllOrders(sort_by_time, sort_by_status, search);
    if (format === 'true'){
      orders = reformatAllOrders(orders);
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500);
  }
});

export default router;
