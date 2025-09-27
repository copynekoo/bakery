import express from "express";
import { getAllProductItems } from "../controllers/productItemController.js"

const productItemRouter = express.Router();

productItemRouter.get("/", async (req, res) => {
  const products = await getAllProductItems(req);
  res.send(products);
});

export default productItemRouter;