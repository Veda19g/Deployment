const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  documents: [{ type: String, ref: 'Document' }],
});

const Workspace = mongoose.model('Workspace', WorkspaceSchema);
module.exports = Workspace;