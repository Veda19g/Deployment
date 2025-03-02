const Workspace = require("../models/Workspace.Model");
const Document = require("../models/Document.Model");
const User = require("../models/User.Model");
const { v4: uuidV4 } = require("uuid");

const createWorkspace = async (req, res) => {
    
    const createdBy=req.userId

    try {
    const { name, description } = req.body;

    if (!name || !createdBy) {
      return res.status(400).json({ error: "Name and createdBy are required" });
    }

    const workspace = new Workspace({ name, description, createdBy });
    await workspace.save();

    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWorkspaceById = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId)
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .populate("documents", "_id data name");

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const addMemberToWorkspace = async (req, res) => {
  try {
    const { workspaceId, email } = req.body;

    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user._id;

    // Find workspace
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    // Check if user is already a member
    if (workspace.members.includes(userId)) {
      return res.status(400).json({ error: "User is already a member" });
    }

    // Add user to workspace members
    workspace.members.push(userId);
    await workspace.save();

    // Send email notification
    try {
      await workspace.populate("createdBy", "email"); // Ensure createdBy is an email
      await sendEmail(email, workspace.name, workspace.createdBy.email);
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      // Don't fail the request due to email issues
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ error: error.message });
  }
};


const createDocumentinWorkspace = async (req, res) => {

  try{
    const { workspaceId, name } = req.body;
    const documentId = uuidV4(); 

    const newDocument = await Document.create({ _id: documentId, name, data: "" });

    await Workspace.findByIdAndUpdate(workspaceId, { $push: { documents: newDocument._id } });

    res.status(201).json(newDocument);
  }
  catch(error){
    res.status(500).json({ error: error.message });
  }


}


const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findByIdAndDelete(workspaceId);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllWorkspaces = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is available from authentication middleware
    const workspaces = await Workspace.find({
      $or: [{ createdBy: userId }, { members: userId }]
    }).populate("createdBy", "name email")
      .populate("members", "name email")
      .populate("documents", "_id data");

    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createWorkspace,
  getWorkspaceById,
  addMemberToWorkspace,
  createDocumentinWorkspace,
  deleteWorkspace,
  getAllWorkspaces
};