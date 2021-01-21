const mongoose = require('mongoose');
const CanvasSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, "Name already used"],
        required: [true, "Please add a name"]
    },
    category: {
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    image: {
        type: String,
    },
    stage: {
        type: String,
    },
    backImage: {
        type:String
    },
    public_id:{
        type: String
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
},{
    timestamps: true,
  })

module.exports = mongoose.model('Canvas', CanvasSchema)
