const { Server } = require("socket.io");
const { findOrCreateDocument } = require("../controllers/document.controller");
const Document = require("../models/Document.Model");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'https://deployment-silk-phi.vercel.app', // Allow frontend to connect
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("get-document", async (documentId) => {
      const document = await findOrCreateDocument(documentId);
      socket.join(documentId); // Join the room for this document
      socket.emit("load-document", document.data); // Send the document data to the client

      // Listen for changes from the client
      socket.on("send-changes", (delta) => {
        socket.broadcast.to(documentId).emit("receive-changes", delta); // Broadcast changes to other clients in the same room
      });

      // Listen for document save requests
      socket.on("save-document", async (data) => {
        await Document.findByIdAndUpdate(documentId, { data }); // Save the document to the database
      });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
}

module.exports = initializeSocket;
