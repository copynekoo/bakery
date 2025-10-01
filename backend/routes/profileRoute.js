import express from "express"
import bodyParser from "body-parser";
import { verifyToken } from "../middleware/authMiddleware.js"
import { getProfileData, setDefaultShippingDst, getDefaultShippingDst } from "../controllers/profileController.js"

const router = express.Router();

router.use(bodyParser.json());

router.get('/', verifyToken, async (req, res) => {
  const username = req.username;
  const profile = await getProfileData(username);
  res.status(200).json(profile);
});

router.put("/defaultshippingdst", verifyToken, async (req, res) => {
  try {
    const username = req.username;
    const { defaultshippingdst } = req.body;
    if (!(defaultshippingdst === '')) setDefaultShippingDst(username, defaultshippingdst);
    else setDefaultShippingDst(username, null);
    res.status(200).json({
      "status": "success",
      "message": "successfully update default shipping destination",
    });
  } catch (error) {
    res.status(500).json({
      "status": "failed",
      "message": "error"
    })
  }
});

router.get("/defaultshippingdst", verifyToken, async (req, res) => {
  const username = req.username;
  const shippingdestination = await getDefaultShippingDst(username);
  res.status(200).json(shippingdestination);
});

export default router;