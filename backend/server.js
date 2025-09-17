import express from 'express'
import productRouter from './routes/productRoute.js'
import cors from 'cors'
import 'dotenv/config'

const app = express();
const port = process.env.SERVERPORT || 3000;

app.use(cors())
var corsOptions = {
  origin: process.env.FRONTENDDOMAIN,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use("/api/product", cors(corsOptions), productRouter);

app.get("/", (req, res) => {
  res.send("Hi!");
});

app.listen(port, () =>
  console.log(`Backend listening on port ${port}!`),
);