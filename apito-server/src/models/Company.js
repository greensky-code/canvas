const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    user_id:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,   
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email"
        ]
    },
    address: {
        type: String,
        required: [true, "Add Address"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model('Company', CompanySchema)