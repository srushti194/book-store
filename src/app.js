const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require("http");
const server = http.createServer(app);
const { PORT } = require("./config/key");
require("./connection/db");
const OrderSchema = require("./models/orderModel");
const OrderItemSchema = require("./models/orderItemModel");
const BookSchema = require("./models/booksModel")

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

server.listen(PORT, () => {
  console.log("Server is listning on port:", PORT);
});

const bookRoute = require("./routes/bookRoute");
app.use("/api/books", bookRoute);

const cartRoute = require("./routes/cartRoute");
app.use("/api/cart", cartRoute);

const orderRoute = require("./routes/orderRoute");
app.use("/api/orders", orderRoute);

const authRoute = require("./routes/userRoute");
app.use("/api/auth", authRoute);

// For define relation between order and order item
OrderSchema.hasMany(OrderItemSchema, { foreignKey: 'orderId' });
OrderItemSchema.belongsTo(OrderSchema, { foreignKey: 'orderId' });

// For define relation between book and order item
BookSchema.hasMany(OrderItemSchema, { foreignKey: 'bookId' });
OrderItemSchema.belongsTo(BookSchema, { foreignKey: 'bookId' });