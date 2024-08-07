const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const verificationSchema = new Schema({
    
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const Verification = mongoose.model("Verification", verificationSchema);
module.exports = Verification;