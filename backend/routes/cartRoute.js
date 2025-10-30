import express from "express";
import bodyParser from "body-parser";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getCart, addCartItem, setCartItemQuantity, removeCartItem, clearCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.use(bodyParser.json());
cartRouter.use(verifyToken);

cartRouter.get("/", async (req, res) => {
  try {
    const cart = await getCart(req.username);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const { product_id, quantity, order_method } = req.body;
    if (typeof product_id === "undefined" || typeof quantity === "undefined") {
      return res.status(400).json({ status: "failed", message: "product_id and quantity are required" });
    }
    const parsedProductId = Number(product_id);
    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedProductId) || !Number.isFinite(parsedQuantity)) {
      return res.status(400).json({ status: "failed", message: "product_id and quantity must be numbers" });
    }
    const method = typeof order_method === "string" ? order_method : undefined;
    const updatedCart = await addCartItem(req.username, parsedProductId, parsedQuantity, method);
    res.status(200).json(updatedCart);
  } catch (error) {
    const status = error.message === "Product not found" || error.message.includes("Quantity") || error.message.includes("stock")
      ? 400
      : 500;
    res.status(status).json({ status: "failed", message: error.message });
  }
});

cartRouter.put("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, order_method } = req.body;
    if (typeof quantity === "undefined") {
      return res.status(400).json({ status: "failed", message: "quantity is required" });
    }
    const parsedQuantity = Number(quantity);
    const parsedProductId = Number(productId);
    if (!Number.isFinite(parsedProductId) || !Number.isFinite(parsedQuantity)) {
      return res.status(400).json({ status: "failed", message: "productId and quantity must be numbers" });
    }
    const method = typeof order_method === "string" ? order_method : undefined;
    const updatedCart = await setCartItemQuantity(req.username, parsedProductId, parsedQuantity, method);
    res.status(200).json(updatedCart);
  } catch (error) {
    const status = error.message === "Product not found" || error.message.includes("Quantity") || error.message.includes("stock")
      ? 400
      : 500;
    res.status(status).json({ status: "failed", message: error.message });
  }
});

cartRouter.delete("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const parsedProductId = Number(productId);
    if (!Number.isFinite(parsedProductId)) {
      return res.status(400).json({ status: "failed", message: "productId must be a number" });
    }
    const updatedCart = await removeCartItem(req.username, parsedProductId);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

cartRouter.delete("/", async (req, res) => {
  try {
    await clearCart(req.username);
    res.status(200).json([]);
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
});

export default cartRouter;
