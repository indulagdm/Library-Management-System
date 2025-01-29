const Order = require("../models/orderModel");
const Book = require("../models/bookModel");
const User = require("../models/userModel");
const CustomError = require("../middlewares/CustomError");

const purchaseOrder = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const bookID = req.params.id;

    const userExist = await User.findById(userID);

    const countOrder = await Order.countDocuments({
      userID,
      returnDate: { $gte: new Date() },
    });

    if (countOrder < 3) {
      if (userExist) {
        const bookExist = await Book.findById(bookID);

        if (bookExist) {
          //check if book already on order document.
          const existOrderBookOnUser = await Order.findOne({ bookID, userID });

          if (existOrderBookOnUser) {
            return next(
              new CustomError("You are already purchase this book.", 400)
            );

            //for temporary checking
            // const newOrder = await Order.create({ bookID, userID });
            // if (newOrder) {
            //   res.status(201).json({
            //     message: `${bookExist.title} purchased.`,
            //     data: newOrder,
            //   });

            //   req.newOrder = newOrder;
            //   next();
            // }

            // //end of temporary checking
          } else {
            const newOrder = await Order.create({ bookID, userID });
            if (newOrder) {
              res
                .status(201)
                .json({ message: "Order purchased.", data: newOrder });
              req.newOrder = newOrder;
              next();
            } else {
              return next(new CustomError("Order purchase failed.", 400));
            }
          }
        } else {
          return next(new CustomError("Book not found.", 404));
        }
      } else {
        return next(new CustomError("User not found.", 404));
      }
    } else {
      return next(
        new CustomError(
          "Your purchase limit reached for the validity period.",
          400
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

const returnOrder = async (req, res, next) => {
  try {
    const userID = req.user.id;

    const { ISBN } = req.body;

    if (userID) {
      const findBook = await Book.findOne({ ISBN });
      const bookID = await Book.findOne({ ISBN }).select("bookID");

      const findUserWhoTakeBook = await Order.findOne({ bookID, userID });

      if (findBook) {
        if (findUserWhoTakeBook) {
          // const findBookExtendReturn = await Order.find({
          //   bookID,
          //   userID,
          //   returnDate: { $lte: new Date() },
          // });

          // console.log(findBookExtendReturn);

          const getBook = await Order.findOne({ bookID });

          if (
            String(findUserWhoTakeBook.returnDate) <= new Date().toDateString()
          ) {
            return next(
              new CustomError("You need to pay fine for extend period.", 402)
            );
          } else {
            res.status(200).json({ message: `${findBook.title} returned.` });

            req.getBook = getBook;
            next();
          }
        } else {
          return next(new CustomError("You are not purchase this book", 400));
        }
      }

      // if (findBook) {
      //   const findBookExtendReturn = await Order.find({
      //     returnDate: { $gte: new Date() },
      //   });

      //   if (findBookExtendReturn) {
      //     return next(
      //       new CustomError("You need to pay fine for extend period.", 402)
      //     );
      //   } else {
      //     res.status(200).json({ message: `${findBook.title} returned.` });

      //     req.findBook = findBook;
      //     next();
      //   }
      // }
      else {
        return next(new CustomError("Not find", 400));
      }
    }
  } catch (error) {
    next(error);
  }
};

const formatDate = (date) => {
  const validDate = new Date(date);
  const year = validDate.getFullYear();
  const month = String(validDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(validDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const extendDateOfOrder = async (req, res, next) => {
  try {
    const userID = req.user.id;

    const bookID = req.params.id;

    const getReturnDate = await Order.findOne({ bookID, userID }).select(
      "returnDate"
    );
    // console.log(getReturnDate);

    const getPreviousDate = getReturnDate.returnDate.setDate(
      getReturnDate.returnDate.getDate() - 1
    );

    // console.log(formatDate(getPreviousDate));

    if (
      formatDate(getPreviousDate) === formatDate(new Date()) &&
      formatDate(getReturnDate) >= formatDate(new Date())
    ) {
      const getOrderID = await Order.findOne({ bookID, userID }).select("_id");

      const newReturnDate = new Date();

      new Date(newReturnDate.setDate(newReturnDate.getDate() + 14));

      // console.log(newReturnDate);

      const updateReturnDate = await Order.findByIdAndUpdate(
        getOrderID,
        {
          returnDate: newReturnDate,
        },
        { new: true }
      );

      if (updateReturnDate) {
        res
          .status(200)
          .json({ message: `${getOrderID} updated.`, data: updateReturnDate });
      } else {
        return next(new CustomError("Update failed.", 400));
      }
    } else if (formatDate(getPreviousDate) <= formatDate(new Date())) {
      return next(
        new CustomError(
          "You can extend date, when you pay fine for exceed dates.",
          402
        )
      );
    } else {
      return next(
        new CustomError(
          `You can extend book ${formatDate(getPreviousDate)}`,
          400
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

const getPurchaseOrderBYUser = async (req, res, next) => {
  try {
    const userID = req.user.id;

    const getOrder = await Order.find({ userID: userID })
      .populate("bookID", "title author ISBN")
      .populate("userID", "regNumber");

    if (getOrder) {
      res.status(200).json({ message: "Record found.", data: getOrder });
    } else {
      return next(new CustomError("You are not purchasing any book.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const noOfUsersInOrder = async (req, res, next) => {
  try {
    const distinctUserID = await Order.distinct("userID");
    const count = distinctUserID.length;
    if (count) {
      res.status(200).json({ message: "Record found.", data: count });
    } else {
      return next(new CustomError("No record found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const noOfBooksInOrder = async (req, res, next) => {
  try {
    const distinctBookID = await Order.distinct("bookID");
    const count = distinctBookID.length;

    if (count) {
      res.status(200).json({ message: "Record found.", data: count });
    } else {
      return next(new CustomError("No record found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const detailsOfUsersInOrder = async (req, res, next) => {
  try {
    const userDetails = await Order.find()
      .select("userID")
      .populate("userID", "regNumber")
      .populate("bookID", "ISBN")
      .select("returnDate")
      .select("borrowDate");

    if (userDetails) {
      res.status(200).json({ message: "Record found.", data: userDetails });
    } else {
      return next(new CustomError("No record found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const detailsOfBooksInOrder = async (req, res, next) => {
  try {
    const bookID = req.params.id;

    const bookDetails = await Order.find({ bookID: bookID })
      .populate("userID", "firstName lastName")
      .select("returnDate");

    const count = await Order.countDocuments({ bookID: bookID });
    if (bookDetails) {
      res
        .status(200)
        .json({ message: "Record found.", data: bookDetails, count });
    } else {
      return next(new CustomError("No record found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const orderDetails = async (req, res, next) => {
  try {
    const orderID = req.params.id;

    const orderDetails = await Order.find({ _id: orderID })
      .populate("userID", "firstName lastName regNumber")
      .populate("bookID", "title author ISBN")
      .select("returnDate")
      .select("updatedAt");
    if (orderDetails) {
      res.status(200).json({ message: "Record found.", data: orderDetails });
    } else {
      return next(new CustomError("No record found in this order.", 404));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  purchaseOrder,
  returnOrder,
  extendDateOfOrder,
  getPurchaseOrderBYUser,
  noOfUsersInOrder,
  noOfBooksInOrder,
  detailsOfUsersInOrder,
  detailsOfBooksInOrder,
  orderDetails,
};
