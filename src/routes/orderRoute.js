const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {verifyAuthToken} = require("../middleware/verifyToken");

router.post("/", verifyAuthToken, orderController.placeOrder);
router.get("/", verifyAuthToken, orderController.list);
router.get("/:id", verifyAuthToken, orderController.view);

module.exports = router;