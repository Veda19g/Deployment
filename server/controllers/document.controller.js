const Document = require("../models/Document.Model");

const defaultValue = "";

// Define the function as a constant
const findOrCreateDocument = async (id) => {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
};

module.exports = { findOrCreateDocument };