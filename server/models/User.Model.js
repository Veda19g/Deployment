const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true,default:'admin@abc.com'},
    password: { type: String, required: true}, // Hashed password
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    goggle_scholar_id: { type: String, default: '' },
    research_gate_id: { type: String, default: '' },
    orcid_id: { type: String, default: '' },
    institution: { type: String, default: '' },
    department: { type: String, default: '' },
    position: { type: String, default: '' },
    publications: { type: Array, default: [] },
    interests: { type: Array, default: [] },
    disciplines: { type: Array, default: [] },
    research_areas: { type: Array, default: [] },
  });

const User = mongoose.model('User', UserSchema);

module.exports = User;