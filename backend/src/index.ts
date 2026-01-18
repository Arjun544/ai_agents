import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { personalRoutes } from "./routes/personal";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const app = express();
const server = createServer(app);

// CORS configuration
const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello Express");
});

app.use("/personal", personalRoutes);

// Initialize Socket.IO server
const io = new SocketIOServer(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  transports: ["websocket", "polling"],
  path: "/socket.io/",
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Send socket ID to client for use in API calls
  socket.emit("socket:connected", { socketId: socket.id });

  socket.on("disconnect", (reason) => {
    console.log(`🔌 Socket disconnected: ${socket.id} (${reason})`);
  });

  socket.on("error", (error) => {
    console.error(`🔌 Socket error for ${socket.id}:`, error);
  });
});

// Make io available globally for controllers
(globalThis as any).io = io;

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Express server is running at http://0.0.0.0:${PORT}`);
  console.log(`🔌 Socket.IO server initialized on port ${PORT}`);
  console.log(`🔗 CORS enabled for: ${FRONTEND_URL}`);
});