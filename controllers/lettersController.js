const User = require('../models/User')
const Letter = require('../models/Letter')
const path = require("path");
const fs = require("fs");

// @desc Get all letters
// @route GET /letters
// @access Private
const getAllLetters = async (req, res) => {
    const letters = await Letter.find().lean()

    //if no letters
    if(!letters?.length){
        return res.status(400).json({message: 'No letters found'})
    }

    //add username to each letter before sending the response
    const lettersWithUser = await Promise.all(letters.map(async (letter) => {
        const user = await User.findById(letter.user).lean().exec()
        return { ...letter, username: user.username }
    }))

    res.json(lettersWithUser)
}

// @desc create a new letter
// @route POST /letters
// @access Private
const createNewLetter = async (req, res) => {
    const { user, recipient, title, letterNumber, letterType, category, end, start, description, letterStatus, rejectMessage} = req.body

    //get the file path
    const filepath = req.file.path

    if(!user || !recipient || !title || !letterType) {
        return res.status(400).json({message: 'All fields are required <' + user + '> <' + recipient + '> <' + title + '> <' + letterType + '> <' + category + '>'})
    }   

    const letterData = {
        user: user, 
        recipient: recipient, 
        title: title,
        letterNumber: letterNumber, 
        letterType: letterType, 
        letterStatus: letterStatus, 
        category: category, 
        description: description, 
        rejectMessage: rejectMessage, 
        file: fs.readFileSync(filepath), 
        // filename: filepath,
        end: end, 
        start: start,
    }

    const letter = await Letter.create(letterData)

    //if created
    if(letter){
        res.status(201).json({message: `New letter ${title} created`})
    }else{
        res.status(400).json({message: 'Invalid letter data recieved'})
    }
}

// @desc update a letter
// @route PATCH /letters
// @access Private
const updateLetter = async (req, res) => {
    const { id, user, recipient, title, letterNumber, letterType, category, end, start, description, letterStatus, rejectMessage } = req.body

    //confirm data
    if(!id || !user || !recipient || !title || !letterType){
        return res.status(400).json({message: 'All fields are required'})
    }

    console.log('at letter controller: ', req.file)

    //confirm letter exists to update
    const letter = await Letter.findById(id)
    if(!letter){
        return res.status(400).json({message: 'Letter not found'})
    }

    letter.user = user
    letter.recipient = recipient
    letter.title = title
    letter.letterNumber = letterNumber
    letter.letterType = letterType
    letter.letterStatus = letterStatus
    letter.category = category
    letter.description = description
    letter.rejectMessage = rejectMessage
    letter.start = start
    letter.end = end
    if(req.file){
        letter.file = fs.readFileSync(req.file.path)
    }

    const updatedLetter = await letter.save()

    res.json({message: `${updatedLetter.title} data updated`})
}

// @desc delete a letter
// @route DELETE /letter
// @access Private
const deleteLetter = async (req, res) => {
    const { id } = req.body

    //confirm data
    if(!id){
        return res.status(400).json({message: 'Letter ID required' })
    }

    //confirm letter exists to delete
    const letter = await Letter.findById(id).exec()
    if(!letter){
        return res.status(400).json({message: 'Letter not found, delete failed'})
    }

    const result = await letter.deleteOne()

    const reply = `Letter ${result.title} with ID ${result._id} deleted`

    res.json(reply)
}

const getOneLetter = async (req, res) => {
    const { id } = req.params

    const letter = await Letter.findById(id)
    if(!letter){
        // return next (new Error('Letter not found'))
        return res.status(400).json({message: 'Letter not found, get one letter failed'})
    }
    //console.log(letter)
    const file = letter.file

    //NOTE: previously used res.json(file) but is wrong. Use res.send(file) instead
    res.send(file)
}

module.exports = {
    getAllLetters,
    createNewLetter,
    updateLetter,
    deleteLetter,
    getOneLetter
}