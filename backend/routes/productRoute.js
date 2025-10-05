import express from "express";
import { getAllProducts, getAllProductCategories } from "../controllers/productController.js"

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await getAllProducts();
  res.send(products);
});

productRouter.get("/categories", async (req, res) => {
  const categories = await getAllProductCategories();
  res.send(categories);
});

export default productRouter;
