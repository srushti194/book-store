const { DataTypes } = require("sequelize");
const sequelize = require("../connection/db");

const OrderItemSchema = sequelize.define("OrderItems", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Order',
        key: 'id'
      }
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Books',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {timestamps: true});

module.exports = OrderItemSchema;
