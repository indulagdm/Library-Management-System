const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    bookID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true],
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true],
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
      default: () => {
        const currentDate = new Date();
        return new Date(currentDate.setDate(currentDate.getDate() + 14));
      },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
