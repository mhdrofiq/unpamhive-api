const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    file: Buffer
});

module.exports = mongoose.model("Signature", signatureSchema);