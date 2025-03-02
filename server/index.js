const express = require("express");
const http = require("http");
const cors = require("cors");
const cookies = require("cookie-parser");
const bodyParser = require("body-parser");
const backendRoutes = require("./routes/backend.routes");
const initializeSocket = require("./socket/socket");
const db = require("./db");

// Create Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Middleware

app.use(
  cors({
    origin: "https://deployment-silk-phi.vercel.app", // Allow requests from frontend
    credentials: true, // Allow cookies and authorization headers
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookies());

// Routes
app.use("/api/v1", backendRoutes);

// Start the server
const port = 8000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
