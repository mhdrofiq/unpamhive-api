const User = require('../models/User')
// const Submission = require('../models/Submission')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users)
}

const getOneUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required.' });

    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ "message": `No user matches ID ${req.params.id}.` });
    }
    res.json(user);
}

// @desc create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
    const { username, email, password, role, department, position } = req.body

    //confirm data
    if(!username || !password) {
        return res.status(400).json({message: 'All fields are required'})
    }

    //check for duplicates
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2}).lean().exec()
    if(duplicate){
        return res.status(409).json({message: 'Duplicate username'})
    }

    //hash password
    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = { username, email, "password": hashedPwd, role, department, position }

    //create and store new user
    const user = await User.create(userObject)

    //if created
    if(user){
        res.status(201).json({message: `New user ${username} created`})
    }else{
        res.status(400).json({message: 'Invalid user data recieved'})
    }
}

// @desc update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
    const {id, username, email, role, active, department, position, password } = req.body

    //console.log(req.body)

    //confirm data
    if(!id || !username || !email || !role || !department || !position | typeof active !== 'boolean'){
        return res.status(400).json({message: req.body})
    }

    const user = await User.findById(id).exec()
    
    if(!user){
        return res.status(400).json({message: 'User not found'})
    }

    //check for duplicates
    const duplicate = await User.findOne({ username }).collation({ locale: 'en', strength: 2}).lean().exec()
    //this allows updates to the original user
        //if not equal to id recieved as a var in the req body, it is duplicate
        //if ids are equal, we are working on the same user
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: 'Duplicate username'})
    }

    user.username = username
    user.email = email
    user.role = role
    user.department = department
    user.position = position
    user.active = active

    if(password){
        user.password = await bcrypt.hash(password, 10) //10 salt round
    }

    const updatedUser = await user.save()

    res.json({message: `${updatedUser.username} data updated`})
}

// @desc delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
    const { id } = req.body

    if(!id){
        return res.status(400).json({message: 'User ID required' })
    }

    // //dont delete user if they have a submission
    // const submission = await Submission.findOne({user: id}).lean().exec()
    // if(submission){
    //     return res.status(400).json({message: 'User has assigned submissions'})
    // }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: 'User not found'})
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllUsers,
    getOneUser,
    createNewUser,
    updateUser,
    deleteUser
}