const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const {verifyAuthToken} = require("../middleware/verifyToken");

router.post("/", verifyAuthToken, cartController.add);
router.get("/", verifyAuthToken, cartController.list);
router.delete("/:id", verifyAuthToken, cartController.delete);

module.exports = router;