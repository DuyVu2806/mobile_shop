import dotenv from "dotenv";
import express from "express";
import db from "./database/db.js";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import WebSocket from "ws";
import wsController from "./controllers/websocket/wsController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Run server
const server = app.listen(PORT, () => {
  console.log(`server Started at http://localhost:${PORT}`);
});

// run ws
const wss = new WebSocket.Server({ server: server });

wss.on("connection", (ws) => {
  wsController.handleConnection(ws, wss);
});


app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

// connection Database
db.connect;
// WebSocket setup

// view engine
app.set("view engine", "ejs");
// middleware
app.use(express.static("public"));
// cors
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
// Router
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public", "uploads"))
);

// Import routers
import authAdminRouter from "./routers/admin/authRouter.js";
import adminRouter from "./routers/admin/adminRouter.js";
import roleRouter from "./routers/admin/roleRouter.js";
import categoryRouter from "./routers/admin/categoryRouter.js";
import productRouter from "./routers/admin/productRouter.js";
import fetchCustomerRouter from "./routers/admin/customerRouter.js";
import roomChatRouter from "./routers/admin/chatRouter.js";
import orderRouter from "./routers/admin/orderRouter.js";
import authCustomerRouter from "./routers/customer/authRouter.js";
import cartCustomerRouter from "./routers/customer/cartRouter.js";
import addressCustomerRouter from "./routers/customer/addressRouter.js";
import orderCustomerRouter from "./routers/customer/orderRouter.js";
import customerRouter from "./routers/customer/customerRouter.js";
import chatRouter from "./routers/customer/chatRouter.js";

// admin
app.use("/api/admin/auth", authAdminRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin/role", roleRouter);
app.use("/api/admin/category", categoryRouter);
app.use("/api/admin/product", productRouter);
app.use("/api/admin/customers", fetchCustomerRouter);
app.use("/api/admin/chat", roomChatRouter);
app.use("/api/admin/order", orderRouter);
// customer
app.use("/api/auth", authCustomerRouter);
app.use("/api/cart", cartCustomerRouter);
app.use("/api/address", addressCustomerRouter);
app.use("/api/order", orderCustomerRouter);
app.use("/api", customerRouter);
app.use("/api/chat", chatRouter);
