const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({

        _id: String, // Document ID
        name: String, // Document name
        data: Object, // Document content
      });

const Document = mongoose.model('Document', DocumentSchema);
      
module.exports = Document;