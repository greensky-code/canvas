const Canvas = require("../models/Canvas")
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const cloudinary = require('cloudinary').v2
const sendMail = require("../helper/mail");
const Layer = require("../models/Layer");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const createCanvas = asyncHandler(async (req, res, next) => {
    const { name, backImage } = req.body
    let owner = req.user.id
    if (backImage.startsWith("http")) {
        const canvas = await Canvas.create({
            name,
            owner,
            backImage,
            users: [owner]
        })
        createUserLayer(owner, canvas._id)
        res.status(200).json({
            success: true,
            data: canvas
        })
    } else {
        let newFile = await cloudinary.uploader.upload(backImage)
        console.log(newFile);
        const canvas = await Canvas.create({
            name,
            owner,
            backImage: newFile.url,
            public_id: newFile.public_id,
            users: [owner]
        })
        createUserLayer(owner, canvas._id)
        res.status(200).json({
            success: true,
            data: canvas
        })

    }
})

const getUserCanvas = asyncHandler(async (req, res, next) => {
    const canvas = await Canvas.find({ users: req.user.id })
    res.status(200).json({
        success: true,
        data: canvas
    })
})
const createUserLayer = async(userId, canvasId) => {
    console.log(userId, canvasId);
    let userLayer = await Layer.create({owner: userId, canvas: canvasId})
    return userLayer
}

// const updateCanvas = asyncHandler(async (req, res, next) => {
//     let id = req.params.id
//     const { image } = req.body
    // let canvas = await Canvas.findById(id)
    // if (!canvas) {
    //     return next(new ErrorResponse('Canvas not Found', 404))
    // }
//     console.log(canvas);
//     let newFile = await cloudinary.uploader.upload(image)
//     const data = {
//         image: newFile.url,
//         public_id: newFile.public_id
//     }
//     if (canvas.public_id) {
//         const delFile = await cloudinary.uploader.destroy(canvas.public_id)
//     }
//     canvas = await Canvas.findByIdAndUpdate(id,
//         { $set: data },
//         { new: true, runValidators: true }
//     )
//     res.status(200).json({
//         success: true,
//         data: canvas
//     })
// })
const updateCanvas = asyncHandler(async (req, res, next) => {
    let id = req.params.id
    const { stage, shape,  } = req.body
    let canvas = await Canvas.findById(id)
    if (!canvas) {
        return next(new ErrorResponse('Canvas not Found', 404))
    }
    canvas = await Canvas.findByIdAndUpdate(id,
                { $set: {stage} },
                { new: true, runValidators: true }
            )
    let userLayer = await Layer.findOne({ owner: req.user.id, canvas: id })
        // console.log("seen", shape);
        const data = {
            shape
        }
        userLayer = await Layer.findByIdAndUpdate(userLayer._id,
            // { $set: data },
            {$set: data  },
            { new: true, runValidators: true }
        )
        res.status(200).json({
            success: true,
            data: userLayer
        })

})


const getCanvasById = asyncHandler(async (req, res, next) => {
    let id = req.params.id
    let canvas = await Canvas.findById(id)
    if (!canvas) {
        return next(new ErrorResponse('Canvas not Found', 404))
    }
    res.status(200).json({
        success: true,
        data: canvas
    })
})

const addUser = asyncHandler(async (req, res, next) => {
    const { email, canvasId } = req.body
    console.log(canvasId);
    let user = await User.findOne({ email })
    if (!user) {
        return next(new ErrorResponse(`No user with ${email}`, 404))
    }
    let canvas = await Canvas.findById(canvasId)
    if (!canvas) {
        return next(new ErrorResponse(`Canvas Not found`, 404))
    }
    let userCanvas = await Canvas.findOne({ _id: canvasId, users: user._id })
    if (userCanvas) {
        return next(new ErrorResponse(`User Added Already`, 400))
    }
    await sendMail({
        to: email,
        from: "freshloftfarms@gmail.com",
        fromname: "Apito",
        subject: "Join a project",
        message: `Click <a href='https://apito-e9bde.web.app/design/${canvasId}'>here</a> to edit`,
    })
    canvas = await Canvas.findByIdAndUpdate(canvasId,
        { $push: { users: user._id } },
        { new: true, runValidators: true }
    )
    createUserLayer(user._id, canvasId)
    res.status(200).json({
        success: true,
        message: "User Added Succesfully"
    })
})

const getLayersByid = asyncHandler(async(req, res, next)=>{
    let id = req.params.id
    let layers = await Layer.find({canvas:id})
    let owner = layers.find(element => element.owner.toString() === req.user.id.toString())
    let index = layers.findIndex(element => element.owner.toString() === req.user.id.toString())
    console.log(index);
    if (index>=0) {
        layers.splice(index, 1)
    }
    const response = {
        owner,
        others: layers
    }
    res.status(200).json({
        success: true,
        data: response
    })
})
const getAllShapes = asyncHandler(async(req, res, next)=>{
    let id = req.params.id
    let userLayer = await Layer.find({canvas:id})
    res.status(200).json({
        success: true,
        data: userLayer
    })
})
module.exports = { createCanvas, getUserCanvas, updateCanvas, getCanvasById, addUser, getLayersByid, getAllShapes }