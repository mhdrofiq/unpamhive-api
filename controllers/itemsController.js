const Item = require("../models/Item");
const path = require("path");

const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({ items });
  } catch (error) {
    console.log(error);
  }
};

const addItem = async (req, res) => {
    console.log(req.file.path)
  const { name } = req.body;
  const file = req.file.path;
  const item = await Item.create({ name, file });
  res.status(201).json({ item });
}

const updateItem = async (req, res) => {
    console.log(req.file.path)
  const { id, name } = req.body;
  const file = req.file.path;
  const item = await Item.findById(id)
  item.name = name
  item.file = file
  const updatedItem = await item.save()
  res.status(201).json({ updatedItem });
}

const downloadFile = async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  if (!item) {
    return next(new Error("No item found"));
  }
  const file = item.file;
  const filePath = path.join(__dirname, `../${file}`);
  res.download(filePath);
}

module.exports = {
  getItems,
  addItem,
  downloadFile,
  updateItem
};