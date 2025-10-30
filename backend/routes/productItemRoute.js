import express from "express";
import bodyParser from "body-parser";
import { getAllProductItems, getAllActiveProductItems } from "../controllers/productItemController.js"

const productItemRouter = express.Router();
productItemRouter.use(bodyParser.json());

productItemRouter.get("/", async (req, res) => {
  const on_sale = req.query.on_sale;
  let products;
  if (on_sale === 'true') { products = await getAllActiveProductItems(); }
  else { products = await getAllProductItems(); };
  res.send(products);
});

export default productItemRouter;