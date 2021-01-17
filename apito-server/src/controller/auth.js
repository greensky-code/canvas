const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Canvas = require('../models/Canvas');
const cloudinary = require('cloudinary').v2
const sendMail = require("../helper/mail");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const register = asyncHandler(async(req,res,next)=>{
    const { name, email, password, birthday, fileSource, role} = req.body
    let newFile = "";
    let user;
    if(fileSource) {
        newFile = await cloudinary.uploader.upload(fileSource);
        console.log(newFile);
        user = await User.create({
            name,
            email,
            password,
            birthday,
            fileSource: newFile.url,
            public_id: newFile.public_id,
            role
        })
    } else {
        user = await User.create({
            name,
            email,
            password,
            birthday,
            fileSource,
            role
        })
    }
    
    sendTokenResponse(user, 200,res)
})

const login = asyncHandler(async(req,res,next)=>{
    const {email, password} = req.body
    if (!email || !password) {
        return next(new ErrorResponse('Please provide email and Password', 400))
    }
    const user = await User.findOne({email}).select('+password')
    if (!user) {
        return next( new ErrorResponse('Invalid credentials', 400))
    }
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 400))
    }
    const isActive = await User.findOne({email}).select('active')
    if(!isActive.active) {
        return next(new ErrorResponse('Account with this Email-id is De-activated. Contact ADMIN for re-activation', 400))
    }
    sendTokenResponse(user, 200,res)
})

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.JWT_COOKIE_EXPIRE * 24 * 60 * 60 *1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}
//@desc  Get Current Logged in User
//@route POST /api/v1/auth/user
//@access Private

const loggedInUser = asyncHandler(async(req,res,next)=> {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        data: user
    })
})

//@desc  Forgot Password
//@route POST /api/v1/auth/forgotpassword
//@access Public

const forgotPassword = asyncHandler(async(req,res,next)=> {
    const user = await User.findOne({email: req.body.email})
    if (!user) {
        return next( new ErrorResponse('No User with that email', 404))
    }
    const resetToken = user.getResetPasswordToken()
    await user.save({validateBeforeSave: false})
    //Send Email Utility of your Choice
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`
      await sendMail({
        to: user.email,
        from: "freshloftfarms@gmail.com",
        fromname: "Apito",
        subject: "Password Reset",
        message: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        resetUrl,
    })
    res.status(200).json({
        success: true,
        data: resetUrl
    })
})
//@desc  Reset Password
//@route PUT /api/v1/auth/resetPassword/:resettoken
//@access Public
const resetPassword = asyncHandler(async(req,res,next)=> {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex') 
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()} 
    })
    if (!user) {
        return next( new ErrorResponse('Invalid Token', 400))
        
    }
    user.password = req.body.password
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save()
    sendTokenResponse(user, 200,res)
})

//@desc  Update Current Logged in UserDetails
//@route PUT /api/v1/auth/update
//@access Private

const updateDetails = asyncHandler(async(req,res,next)=> {
    const {name, email, fileSource, birthday} = req.body
    let fields;
    if(fileSource == undefined) {
        fields = {
            name,
            email,
            birthday
        }
    } else {
        if(fileSource.startsWith("http")) {
            fields = {
                name,
                email,
                fileSource,
                birthday
            }
        } else {
            if(fileSource.length == 0) {
                fields = {
                    name,
                    email,
                    birthday
                }
            } else {
                //with new image
                let newFile = await cloudinary.uploader.upload(fileSource);
                fields = {
                    name,
                    email,
                    fileSource: newFile.url,
                    public_id: newFile.public_id,
                    birthday
                }
            }
            
        }
    }
    
    console.log(fields);
    const user = await User.findByIdAndUpdate(req.body.user.id, fields, {
        new:true,
        runValidators: true
    })
    
    res.status(200).json({
        success: true,
        data: user
    })
})

//@desc  Update Current Logged in Password
//@route PUT /api/v1/auth/password
//@access Private

const updatePassword = asyncHandler(async(req,res,next)=> {
    // const fields = {
    //     name: req.body.name,
    //     email: req.body.email
    // }
    let user = await User.findById(req.body.user.id).select('+password');
    console.log(await user.matchPassword(req.body.currentPassword));
    if (! await user.matchPassword(req.body.currentPassword)) {
        return next(new ErrorResponse('Password is incorrect', 400))   
    }
    user.password = req.body.newPassword
    await user.save()
    sendTokenResponse(user, 200, res)
})

//@desc  Log User out / clear cookie
//@route GET /api/v1/auth/logout
//@access Private

const logout = asyncHandler(async(req,res,next)=> {
    req.cookie('token', 'none', {
        expires: new Date(Date.now()+ 10 * 1000),
        httpOnly: true  
    })
    res.status(200).json({
        success: true,
        data: user
    })
})

const deactivateUser = asyncHandler(async(req,res,next)=> {
    const fields = {
        active: false
    }
    const user = await User.findByIdAndUpdate(req.body.id, fields, {
        new:true,
        runValidators: true
    })
    
    res.status(200).json({
        success: true,
        data: user
    })
})

const toogleUserStatus = asyncHandler(async(req,res,next)=> {
    const fields = {
        active: req.body.status
    }
    const user = await User.findByIdAndUpdate(req.body.id, fields, {
        new:true,
        runValidators: true
    })
    
    res.status(200).json({
        success: true,
        data: user
    })
})

const userList = asyncHandler(async(req,res,next)=> {
    const users = await User.find({"role": "user"})
    res.status(200).json({
        success: true,
        data: users
    })
})

const getProjects = asyncHandler(async(req,res,next)=> {
    const canvas = await Canvas.aggregate([
        {
            $lookup: {
            from: User.collection.name,//mongoose 
            localField: "users",//field from input doc
            foreignField: "_id",//field from the documents of the "from" collection
            as: "invitees"
        }
    },
        {
            $lookup: {
            from: User.collection.name,//mongoose 
            localField: "owner",//field from input doc
            foreignField: "_id",//field from the documents of the "from" collection
            as: "ownerDetails"
        }
    },
    ],function (error, data) {
        return res.status(200).json({
            success: true,
            data: data
        });
    })
    // const users = await User.aggregate([{
    //     $lookup: {
    //         from: Canvas.collection.name,//mongoose 
    //         localField: "_id",//field from input doc
    //         foreignField: "owner",//field from the documents of the "from" collection
    //         as: "projectList"
    //     }
    // }]
    // ,function (error, data) {
    //     return res.status(200).json({
    //         success: true,
    //         data: data
    //     });
    // });
    
})

module.exports = { 
    register, 
    login, 
    loggedInUser, 
    forgotPassword, 
    resetPassword, 
    updateDetails, 
    updatePassword,
    deactivateUser, 
    toogleUserStatus,
    userList,
    getProjects,
    logout
}