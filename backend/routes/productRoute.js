import express from "express";
import bodyParser from "body-parser";
import { verifyEmployee } from "../middleware/authMiddleware.js"
import { getAllProducts, getAllProductCategories, insertProduct, updateProduct, deleteProduct } from "../controllers/productController.js"
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./assets/products")
  },
  filename: function (req, file, cb) {
    const fileName = req.params.p_id + '.jpg';
    cb(null, fileName)
  }
})

const upload = multer({
  storage: storage
})

const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter.get("/", async (req, res) => {
  const products = await getAllProducts();
  res.send(products);
});

productRouter.post("/", verifyEmployee, async (req, res) => {
  try {
    const data = req.body;
    const product_id = data.product_id;
    const product_name = data.product_name;
    const product_category = data.product_category;
    const product_price = data.product_price;
    const isSuccessful = await insertProduct(product_id, product_name, product_category, product_price);
    if (isSuccessful) {
      return res.status(200).json({ success: "successfully added product" });
    }
    throw Error("Unsuccessful insert product");
  } catch (error) { 
    res.status(500).json({ failed: "failed to add product" });
  }
});

productRouter.delete("/", verifyEmployee, async (req, res) => {
  try {
    const product_id = req.query.product_id; // Get from query instead of body
    const isSuccessful = await deleteProduct(product_id);
    console.log(isSuccessful);
    if (isSuccessful) {
      return res.status(200).json({ success: "successfully deleted product" });
    }
    throw Error("Fail to delete product");
  } catch (error) { 
    res.status(500).json({ failed: "failed to delete product" });
  }
});

productRouter.put("/", verifyEmployee, async (req, res) => {
  try { 
    const data = req.body;
    const product_id = data.product_id;
    const product_name = data.product_name;
    const product_category = data.product_category;
    const product_price = data.product_price;
    const product_active_sale = data.product_active_sale;
    const isSuccessful = await updateProduct(product_id, product_name, product_category, product_price, product_active_sale);
    if (isSuccessful) {
      return res.status(200).json({ success: "successfully update product" });
    }
    throw Error("Unsuccessful update product");
  } catch (error) { 
    res.status(500).json({ failed: "failed to update product" });
  }
});

productRouter.put("/photo/:p_id", verifyEmployee, upload.single('file'), async (req, res) => {
  try {
    res.status(200).json({"success": "successfully upload product photo"})
  } catch (error) { 
    res.status(500).json({"failed": "failed to upload product photo"})
  }
});

productRouter.get("/categories", async (req, res) => {
  const categories = await getAllProductCategories();
  res.send(categories);
});

export default productRouter;
