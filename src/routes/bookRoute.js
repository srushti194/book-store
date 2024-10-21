const express = require("express");
const router = express.Router();
const bookController = require("../controllers/booksController");
const { verifyAuthToken } = require("../middleware/verifyToken");

router.get("/", verifyAuthToken, bookController.listBooks);
router.get("/:id", verifyAuthToken, bookController.viewBook);

module.exports = router;
