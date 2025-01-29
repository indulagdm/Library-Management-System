const BookInventory = require("../models/bookInventoryModel");
const Book = require("../models/bookModel");
const CustomError = require("../middlewares/CustomError");
const Order = require("../models/orderModel");

const addInventory = async (req, res, next) => {
  try {
    const bookID = req.params.id;

    const existBook = await Book.findById(bookID);

    const existBookInventory = await BookInventory.findOne({ bookID });

    if (existBookInventory) {
      return next(new CustomError("Book quantity already recoded.", 400));
    }

    const { totalNumberOfBooks } = req.body;

    if (existBook) {
      const newBookInventory = await BookInventory.create({
        bookID,
        totalNumberOfBooks,
      });

      if (newBookInventory) {
        res.status(201).json({
          message: "New Book Inventory added.",
          data: newBookInventory,
        });
      } else {
        return next(new CustomError("Inventory added unsuccessful.", 400));
      }
    } else {
      return next(new CustomError("No book found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const getBookInventory = async (req, res, next) => {
  try {
    const bookID = req.params.id;

    const existBook = await Book.findById(bookID);

    const existBookInventory = await BookInventory.findOne({ bookID });

    if (existBook) {
      if (existBookInventory) {
        res
          .status(200)
          .json({ message: "Book recode found.", data: existBookInventory });
      } else {
        return next(new CustomError("No book inventory found.", 404));
      }
    } else {
      return next(new CustomError("No book record found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const updateBookInventoryForBorrow = async (req, res, next) => {
  try {
    // const bookID = req.params.id;

    const { bookID } = req.newOrder;

    const existBook = await Book.findById(bookID);

    const existBookInventory = await BookInventory.findOne({ bookID });

    if (existBook) {
      if (existBookInventory) {
        if (existBookInventory.totalNumberOfBooks === 0) {
          return next(new CustomError("All books are purchased.", 400));
        } else {
          existBookInventory.currentNoOfBooks -= 1;

          const updateInventory = await existBookInventory.save();

          if (updateInventory) {
            res
              .status(200)
              .json({ message: "Inventory updated.", data: updateInventory });
          } else {
            return next(new CustomError("Some error occurs.", 400));
          }
        }
      } else {
        return next(new CustomError("No inventory found.", 404));
      }
    } else {
      return next(new CustomError("No book record found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const updateInventoryForReturn = async (req, res, next) => {
  try {
    const { bookID } = req.getBook;

    const existBook = await Book.findById(bookID);
    // console.log(existBook)

    const existBookInventory = await BookInventory.findOne({ bookID });

    if (existBook) {
      if (existBookInventory) {
        const count = (existBookInventory.currentNoOfBooks += 1);

        if (count <= existBookInventory.totalNumberOfBooks) {
          const updateInventory = await existBookInventory.save();
          res
            .status(200)
            .json({ message: "Inventory updated.", data: updateInventory });
        } else {
          return next(new CustomError("Exceed the total number of books", 400));
        }
      } else {
        return next(new CustomError("No inventory found.", 404));
      }
    } else {
      return next(new CustomError("No book record found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addInventory,
  getBookInventory,
  updateBookInventoryForBorrow,
  updateInventoryForReturn,
};
