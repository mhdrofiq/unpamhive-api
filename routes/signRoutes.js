const express = require('express')
const router = express.Router()
const signatureController = require('../controllers/signatureController')
const upload = require('../middleware/multer')

router.route('/')
    .post(upload.single('file'), signatureController.addSignature)
    .delete(signatureController.deleteSignature)

router.route("/:id").get(signatureController.getSignature);

module.exports = router