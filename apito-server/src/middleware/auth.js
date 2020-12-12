const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User')


const protect = asyncHandler(async (req, res, next) => {
    let token;
    // console.log(req.headers.authorization);
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    // else if(req.cookies.token) {
    //     token = req.cookies.token
    // }
    if (token == undefined) {
        return next(new ErrorResponse('Not authorized to access', 401))
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return next(new ErrorResponse('Not authorized to access', 401))
        }
        req.user = await User.findById(decoded.id)
        next()
    } catch (err) {
        console.error(err);
        return next(new ErrorResponse('Not authorized to access', 401))
    }
})

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized`, 401))
        }
        next()
    }
}

module.exports = { protect, authorize }