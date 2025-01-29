const express = require("express");
const {
  registerBook,
  getBooks,
  getBookByID,
  updateBook,
  deleteBook,
  deleteGenre,
  fetchBooksForReport,
  printReport,
  noOfBooks,
} = require("../controllers/bookController");
const validateToken = require("../middlewares/validateToken");
const authorizedRoles = require("../middlewares/authorizedRoles");

const router = express.Router();

router.post(
  "/registerBook",
  validateToken,
  authorizedRoles("librarian", "teacher"),
  registerBook
);
router.get("/books", validateToken, getBooks);
router.get("/book/:id", validateToken, getBookByID);
router.put(
  "/updateBook/:id",
  validateToken,
  authorizedRoles("librarian"),
  updateBook
);

router.delete(
  "/deleteBook/:id",
  validateToken,
  authorizedRoles("librarian"),
  deleteBook
);

router.post(
  "/deleteBook-s-genre/:id",
  validateToken,
  authorizedRoles("librarian"),
  deleteGenre
);

router.get(
  "/report",
  validateToken,
  authorizedRoles("librarian", "teacher"),
  fetchBooksForReport
);
router.get(
  "/report/print",
  validateToken,
  authorizedRoles("librarian", "teacher"),
  printReport
);

router.post(
  "/noOfBooks",
  validateToken,
  authorizedRoles("librarian","teacher"),
  noOfBooks
);

module.exports = router;
