const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    user_id:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    category: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: [true, "Add event date details"]
    },
    desc: {
        type: String,
        required: [true, "Add Description"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model('Reminder', ReminderSchema)