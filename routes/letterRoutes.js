const express = require('express')
const router = express.Router()
const lettersController = require('../controllers/lettersController')
const upload = require('../middleware/multer')

router.route('/')
    .get(lettersController.getAllLetters)
    .post(upload.single('file'), lettersController.createNewLetter)
    .patch(upload.single('file'), lettersController.updateLetter)
    .delete(lettersController.deleteLetter)

router.route('/download/:id').get(lettersController.downloadLetter)

module.exports = router