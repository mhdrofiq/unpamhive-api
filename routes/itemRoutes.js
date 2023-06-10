const upload = require("../middleware/multer");
const express = require("express");

const { getItems, addItem, updateItem, downloadFile } = require("../controllers/itemsController");

const router = express.Router();

router.route("/").get(getItems).post(upload.single("file"), addItem).patch(upload.single("file"), updateItem);
router.route("/download/:id").get(downloadFile);

module.exports = router;