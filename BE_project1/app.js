require("dotenv").config();
const express = require("express");
const db = require("./database/db.js");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const cors = require("cors");
const Websocket = require("ws");
const wsController = require("./controllers/websocket/wsController.js")

// Run server
const server = app.listen(PORT, (req, res) => {
  console.log(`server Started at http://localhost:${PORT}`);
});

// run ws
const wss = new Websocket.Server({ server: server });

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

// Connect Router
// admin
const authAdminRouter = require("./routers/admin/authRouter.js");
const adminRouter = require("./routers/admin/adminRouter.js");
const roleRouter = require("./routers/admin/roleRouter.js");
const categoryRouter = require("./routers/admin/categoryRouter.js");
const productRouter = require("./routers/admin/productRouter.js");
const fetchCustomerRouter = require("./routers/admin/customerRouter.js");
const roomChatRouter = require("./routers/admin/chatRouter.js");
const orderRouter = require("./routers/admin/orderRouter.js");
// customer
const authCustomerRouter = require("./routers/customer/authRouter.js");
const cartCustomerRouter = require("./routers/customer/cartRouter.js");
const addressCustomerRouter = require("./routers/customer/addressRouter.js");
const orderCustomerRouter = require("./routers/customer/orderRouter.js");
const customerRouter = require("./routers/customer/customerRouter.js");
const chatRouter = require("./routers/customer/chatRouter.js");
const Contact = require("./models/Contact.js");

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
