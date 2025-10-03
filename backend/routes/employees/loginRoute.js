import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUser } from "../../controllers/employees/accountController.js"

const loginRouter = express.Router();

loginRouter.use(bodyParser.json());
loginRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await findUser(username);
    if (!user) return res.status(401).json({ error: 'Authentication failed' });
    const hashedPassword = user[0]['password'];
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) return res.status(401).json({ error: 'Authentication failed invalid password' });
    const token = jwt.sign({ username: username }, 'your-secret-key', {
      expiresIn: '1h'
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default loginRouter;