const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    // NOTE: this was giving me an error bcs it couldn't find a user using the refresh token. I didnt have the refresh token saved in the db. Issue solved after adding the refreshToken attribute in the User model
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden 

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {

            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            const role = foundUser.role;
            const userId = foundUser._id;
            const username = foundUser.username;

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": username,
                        "role": role,
                        'userId': userId,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }
            );
            res.json({ username, userId, role, accessToken })
        }
    );
}

module.exports = { handleRefreshToken }