const Signature = require("../models/Signature");
const path = require("path");

const getSignature = async (req, res) => {
    const { id } = req.params;
    const signature = await Signature.findOne({ user: id });
    if (!signature) {
        return res.json({message: 'Signature not found' })
    }
    const file = signature.file;
    const filePath = path.join(__dirname, `../${file}`);
    res.download(filePath);
};

const addSignature = async (req, res) => {
    console.log(req.file.path)
    const { user } = req.body;
    const file = req.file.path;
    const signature = await Signature.create({ user, file });
    res.status(201).json({ signature });
}

const deleteSignature = async (req, res) => {
    const { id } = req.body
    if(!id){
        return res.status(400).json({message: 'User ID required' })
    }
    const signature = await Signature.findOne({ user: id }).exec()
    if(!signature){
        return res.status(400).json({message: 'Signature not found, delete failed'})
    }
    const result = await signature.deleteOne()
    const reply = `Signature with user ID ${result.user} deleted`
    res.json(reply)
}


module.exports = {
    getSignature,
    addSignature,
    deleteSignature,
};