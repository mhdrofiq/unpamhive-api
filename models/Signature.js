const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    file: {
        type: String,
        required: [true, "Please provide a signature image"],
    },
});

module.exports = mongoose.model("Signature", signatureSchema);