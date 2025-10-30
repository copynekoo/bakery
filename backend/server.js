import express from 'express'
import productRouter from './routes/productRoute.js'
import stockRouter from './routes/stockRoute.js'
import productItemRouter from './routes/productItemRoute.js'
import loginRouter from './routes/loginRoute.js'
import registerRouter from './routes/registerRoute.js'
import verifyRouter from './routes/verifyRoute.js'
import profileRouter from './routes/profileRoute.js'
import orderRouter from './routes/orderRoute.js'
import cartRouter from './routes/cartRoute.js'
import employeeLoginRouter from './routes/employees/loginRoute.js'
import cors from 'cors'
import 'dotenv/config'

const app = express();
const port = process.env.SERVERPORT || 3000;

var corsOptions = {
  origin: process.env.FRONTEND_DOMAIN,
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use('/assets', express.static('assets'))
app.use('/public', express.static('public'))

app.use("/api/product", cors(corsOptions), productRouter);
app.use("/api/productItems", cors(corsOptions), productItemRouter);
app.use("/api/stock", cors(corsOptions), stockRouter);
app.use("/api/auth/login", cors(corsOptions), loginRouter);
app.use("/api/auth/register", cors(corsOptions), registerRouter);
app.use("/api/verifyToken", cors(corsOptions), verifyRouter);
app.use("/api/profile", cors(corsOptions), profileRouter);
app.use("/api/orders", cors(corsOptions), orderRouter);
app.use("/api/cart", cors(corsOptions), cartRouter);

app.use("/api/employees/auth/login", cors(corsOptions), employeeLoginRouter);

app.get("/", (req, res) => {
  res.send("Hi!");
});

app.listen(port, () =>
  console.log(`Backend listening on port ${port}!`),
);
