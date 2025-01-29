const express = require("express");

const router = express.Router();

const validateToken = require("../middlewares/validateToken");

const authorizedRoles = require("../middlewares/authorizedRoles");

const {
  addInventory,
  getBookInventory,
} = require("../controllers/bookInventoryController");

router.post(
  "/addInventory/:id",
  validateToken,
  authorizedRoles("librarian"),
  addInventory
);
router.get(
  "/getInventory/:id",
  validateToken,
  authorizedRoles("librarian", "teacher"),
  getBookInventory
);

module.exports = router;
