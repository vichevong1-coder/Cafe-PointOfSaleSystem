const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },  
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 20,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role:{
        type: String,
        enum: ['admin','cashier'],
        default: 'cashier',
    },
    pin:{
        type: String,
        required: true,
       
    },
    isActive:{
        type: Boolean,
        default: true,
    },
    failedLoginAttempts:{
        type: Number,
        default: 0,
    },
    lockUntil:{
        type: Date,
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);
    