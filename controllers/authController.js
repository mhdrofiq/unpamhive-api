const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const role = foundUser.role
        const userId = foundUser._id
        const username = foundUser.username
        
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": username,
                    "role": role,
                    'userId': userId,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' } //set to minutes/hours
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' } //set to days
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        //console.log(result);
        // console.log(role);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to user
        res.json({username, userId, role, accessToken });

    } else {
        res.sendStatus(401);
    }
}

const handleRegister = async (req, res) => {
    const { username, email, password, role, department, position } = req.body;
    // if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
        const result = await User.create({
            "username": username,
            "password": hashedPwd,
            "email": email,
            "role": role,
            "department": department,
            "position": position
        });

        //console.log(result);

        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const handleLogout = async (req, res) => {
     //check for the cookie
    const cookies = req.cookies
    
    //if the cookie doesnt exist
    if (!cookies?.jwt) return res.sendStatus(204) //204 means no content

    //clearing the cookie 
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })

    //NOTE: when testing the logout endpoint in postman, you need to remove the secure attribute from the cookie in the headers
}

module.exports = { handleLogin, handleRegister, handleLogout };
