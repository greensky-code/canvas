const mongoose = require('mongoose');
const LayerSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    canvas: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Canvas"
    },
    shape: {
        type: Array
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Layer', LayerSchema)
