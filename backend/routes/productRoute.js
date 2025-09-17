import express from "express";
import { getAllProducts } from "../controllers/productController.js"

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
  const products = await getAllProducts();
  res.send(products);
});

export default productRouter;