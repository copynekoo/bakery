import express from "express";
import bodyParser from "body-parser";
import { verifyEmployee } from "../middleware/authMiddleware.js"
import { getAllProducts, getAllProductCategories, insertProduct } from "../controllers/productController.js"

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
    insertProduct(product_id, product_name, product_category, product_price);
    res.status(200).json({"success": "successfully added product"})
  } catch (error) { 
    res.status(500).json({"failed": "failed to add product"})
  }
});

productRouter.get("/categories", async (req, res) => {
  const categories = await getAllProductCategories();
  res.send(categories);
});

export default productRouter;
