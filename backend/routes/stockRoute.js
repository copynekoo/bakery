import express from "express";
import { getAllStocks } from "../controllers/stockController.js"

const stockRouter = express.Router();

stockRouter.get("/", async (req, res) => {
  const stocks = await getAllStocks();
  res.send(stocks);
});

export default stockRouter;