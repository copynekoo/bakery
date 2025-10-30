import express from "express";
import bodyParser from "body-parser";
import { verifyEmployee } from "../middleware/authMiddleware.js"
import { getAllProducts, getAllProductCategories, insertProduct, updateProduct } from "../controllers/productController.js"
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
    const isSuccessful = insertProduct(product_id, product_name, product_category, product_price);
    if (isSuccessful){
      res.status(200).json({"success": "successfully added product"})
    }
    throw Error("Unsucessful insert product")
  } catch (error) { 
    res.status(500).json({"failed": "failed to add product"})
  }
});

productRouter.put("/", verifyEmployee, async (req, res) => {
  try {
    const data = req.body;
    const product_id = data.product_id;
    const product_name = data.product_name;
    const product_category = data.product_category;
    const product_price = data.product_price;
    const isSuccessful = updateProduct(product_id, product_name, product_category, product_price);
    if (isSuccessful){
      res.status(200).json({"success": "successfully update product"})
    }
    throw Error("Unsucessful insert product")
  } catch (error) { 
    res.status(500).json({"failed": "failed to update product"})
  }
});

productRouter.put("/photo/:p_id", verifyEmployee, upload.single('file'), async (req, res) => {
  try {
    const data = req.body;
    const p_id = data.p_id;
    const isSuccessful = upload()
    if (isSuccessful){
      res.status(200).json({"success": "successfully upload product photo"})
    }
    throw Error("Unsucessful insert product")
  } catch (error) { 
    res.status(500).json({"failed": "failed to upload product photo"})
  }
});

productRouter.get("/categories", async (req, res) => {
  const categories = await getAllProductCategories();
  res.send(categories);
});

export default productRouter;
