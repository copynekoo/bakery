import express from "express";
import bodyParser from "body-parser";
import { register } from "../controllers/accountController.js"
import bcrypt from "bcrypt";

const registerRouter = express.Router();

registerRouter.use(bodyParser.json());
registerRouter.post("/", async (req, res) => {
  const { username, password, firstname, lastname } = req.body;
  if (username && password && firstname && lastname) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const registerAccount = await register(username, hashedPassword, firstname, lastname);
    res.status(registerAccount.status).send(registerAccount);
  } else {
    res.status(500).json({message: "Nice try, inputting empty string"});
  }
});

export default registerRouter;