// const express = require("express");
// const app = express();
// const port = 3000;

// app.use(express.json()); // Middleware to parse JSON request bodies

// let logs = []; // Store logs in memory

// // API endpoint to receive any kind of data
// app.post("/log", (req, res) => {
//   const logEntry = {
//     timestamp: new Date().toISOString(),
//     data: req.body,
//   };
//   logs.push(logEntry);
//   res.json({ message: "Log received", log: logEntry });
// });

// // Endpoint to view logs in beautified JSON format
// app.get("/home", (req, res) => {
//   res.setHeader("Content-Type", "application/json");
//   res.send(JSON.stringify(logs, null, 4));
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.static(path.join(__dirname, "public")));

let logs = []; // Store logs in memory

// API endpoint to receive any kind of data
app.post("/log", (req, res) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    data: req.body,
  };
  logs.push(logEntry);
  io.emit("new_log", logs); // Emit updated logs to connected clients
  res.json({ message: "Log received", log: logEntry });
});

// Serve real-time log viewer
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// WebSocket connection
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.emit("init_logs", logs); // Send existing logs to newly connected client

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
