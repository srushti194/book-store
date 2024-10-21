const { DataTypes } = require("sequelize");
const sequelize = require("../connection/db");

const CartSchema = sequelize.define("Cart", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {timestamps: true});

module.exports = CartSchema;
