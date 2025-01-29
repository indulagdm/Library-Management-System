const express = require("express");
const {
  purchaseOrder,
  returnOrder,
  extendDateOfOrder,
  getPurchaseOrderBYUser,
  noOfUsersInOrder,
  noOfBooksInOrder,
  detailsOfUsersInOrder,
  detailsOfBooksInOrder,
  orderDetails,
} = require("../controllers/orderController");
const validateToken = require("../middlewares/validateToken");
const {
  updateBookInventoryForBorrow,
  updateInventoryForReturn,
} = require("../controllers/bookInventoryController");

const authorizedRoles = require("../middlewares/authorizedRoles");

const router = express.Router();

router.post(
  "/purchaseOrder/:id",
  validateToken,
  purchaseOrder,
  updateBookInventoryForBorrow
);
router.post(
  "/returnOrder",
  validateToken,
  returnOrder,
  updateInventoryForReturn
);

router.post("/getPursingOrders", validateToken, getPurchaseOrderBYUser);

router.post("/extendDate/:id", validateToken, extendDateOfOrder);

router.post(
  "/noOfUsersInOrder",
  validateToken,
  authorizedRoles("librarian"),
  noOfUsersInOrder
);

router.post(
  "/noOfBooksInOrder",
  validateToken,
  authorizedRoles("librarian"),
  noOfBooksInOrder
);

router.post(
  "/userDetails",
  validateToken,
  authorizedRoles("librarian"),
  detailsOfUsersInOrder
);

router.post(
  "/bookDetails/:id",
  validateToken,
  authorizedRoles("librarian"),
  detailsOfBooksInOrder
);

router.get(
  "/orderDetails/:id",
  validateToken,
  authorizedRoles("librarian"),
  orderDetails
);

module.exports = router;
