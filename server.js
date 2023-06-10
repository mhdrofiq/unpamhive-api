//this lets us use dotenv throughout our package
require('dotenv').config()
require('express-async-errors') //this lets us use async/await with express (instead of try/catch and asynchandler inside the controller)
const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const { logEvents } = require('./middleware/logger')
const PORT = process.env.PORT || 3500
const verifyJWT = require('./middleware/verifyJWT')

//uncomment to check environment variables
console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)

//other origins can request resources from our api
//api is available to the public
    //app.use(cors())
//this only allows the urls we put in allowedOrigins to access our resources from api
app.use(cors(corsOptions))

//this is built in middleware, gives the ability to process json
app.use(express.json())

app.use(cookieParser())

//this is telling the server where to grab static files
//__dirname is a global variable ufor the directory name, then look at the 'public' folder
app.use('/', express.static(path.join(__dirname, 'public')))
//app.use(express.static('public')) //this will still work because it is relative

app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/refresh', require('./routes/refreshRoutes'))

// app.use(verifyJWT)

app.use('/letters', require('./routes/letterRoutes'))
app.use('/signature', require('./routes/signRoutes'))

//NOTE: routes that want veryifyjwt need to be under 'app.use(verifyJWT)
// app.use(verifyJWT)
app.use('/users', require('./routes/userRoutes'))

// FOR DEBUG ONLY
// app.use("/items/new",  require("./routes/itemRoutes"))
// app.use("/items",  require("./routes/itemRoutes"))

//everything that doesnt go to the routes above goes here
app.all('*', (req, res) => {
    res.status(404)
    //look at the headers that come in and determine what kind of response to send
    //if the request has an accepts header that is html
    if(req.accepts('html')){
        //send the 404 page
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    //if there was a json request that wasnt routed properly
    } else if(req.accepts('json')){
        res.json({message: '404 Not Found'})
    //if it's not html or json
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log')
})