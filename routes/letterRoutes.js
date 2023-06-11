const express = require('express')
const router = express.Router()
const lettersController = require('../controllers/lettersController')
const upload = require('../middleware/multer')

router.route('/')
    .get(lettersController.getAllLetters)
    .post(upload.single('file'), lettersController.createNewLetter)
    .patch(upload.single('file'), lettersController.updateLetter)
    .delete(lettersController.deleteLetter)

router.route('/:id').get(lettersController.getOneLetter)

module.exports = router