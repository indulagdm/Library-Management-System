const Book = require("../models/bookModel");
const CustomError = require("../middlewares/CustomError");
const puppeteer = require("puppeteer");
const path = require("path");
// const reportTemp = require("../views/bookReportTemplate.ejs")

const registerBook = async (req, res, next) => {
  try {
    const { title, author, ISBN, genre, publicationYear } = req.body;

    const existBook = await Book.findOne({ ISBN: ISBN });

    if (existBook) {
      return next(new CustomError("This book already stored.", 400));
    } else {
      const newBook = await Book.create({
        title,
        author,
        ISBN,
        genre,
        publicationYear,
      });

      if (newBook) {
        res.status(201).json({ message: "new book added.", data: newBook });
      } else {
        return next(new CustomError("New book added failed.", 400));
      }
    }
  } catch (error) {
    next(error);
  }
};

const getBooks = async (req, res, next) => {
  try {
    const existBooks = await Book.find();

    if (existBooks) {
      res.status(200).json({ message: "Result found.", data: existBooks });
    } else {
      return next(new CustomError("No result found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const getBookByID = async (req, res, next) => {
  try {
    const id = req.params.id;

    const existBook = await Book.findById(id);

    if (existBook) {
      res.status(200).json({ message: "Result found.", data: existBook });
    } else {
      return next(new CustomError("No result found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const id = req.params.id;

    const existBook = await Book.findById(id);

    if (existBook) {
      const updatedBook = await Book.findByIdAndUpdate(
        id,
        {
          title: req.body.title,
          author: req.body.author,
          ISBN: req.body.ISBN,
          $push: { genre: { $each: req.body.genre } },
          publicationYear: req.body.publicationYear,
        },
        { new: true }
      );

      if (updatedBook) {
        res
          .status(200)
          .json({ message: "Update successful.", data: updatedBook });
      } else {
        return next(new CustomError("Updated failed.", 400));
      }
    } else {
      return next(new CustomError("No record found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const id = req.params.id;

    const existBook = await Book.findById(id);

    if (existBook) {
      const deletedBook = await Book.findByIdAndDelete(id);

      if (deletedBook) {
        res.status(200).json({ message: "Book record deleted." });
      } else {
        return next(new CustomError("Delete failed.", 400));
      }
    } else {
      return next(new CustomError("No record found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const deleteGenre = async (req, res, next) => {
  try {
    const id = req.params.id;

    const existBook = await Book.findById(id);

    const { genre: genreToRemove } = req.body;

    if (!existBook) {
      return next(new CustomError("No record found.", 404));
    }
    if (!existBook.genre.includes(genreToRemove)) {
      return next(new CustomError("Genre not found in this book.", 400));
    } else {
      const updateGenre = await Book.findByIdAndUpdate(
        id,
        {
          $pull: { genre: genreToRemove },
        },
        { new: true }
      );
      if (updateGenre) {
        res.status(200).json({ message: "Genre updated.", data: updateGenre });
      } else {
        return next(new CustomError("Genre update failed.", 400));
      }
    }

    // next();
  } catch (error) {
    next(error);
  }
};

const fetchBooksForReport = async (req, res, next) => {
  try {
    // const books = await Book.find();

    const data = {
      title: "Library Report",
      books: await Book.find(),
      logoPath: "/images/iconImage.png",
    };

    if (data) {
      res.render("bookReportTemplate.ejs", data);
    } else {
      return next(new CustomError("No record found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const printReport = async (req, res, next) => {
  try {
    const browser = await puppeteer.launch({
      headless: false, // Open a visible browser window for printing
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    // const books = await Book.find(); // Assuming you fetch the books from your database

    const data = {
      title: "Library Report",
      books: await Book.find(),
      logoPath: `http://localhost:4000/images/iconImage.png`,
    };

    // Render EJS file
    const renderedHtml = await new Promise((resolve, reject) => {
      res.render("bookReportTemplate.ejs", data, (err, html) => {
        if (err) return reject(err);
        else resolve(html);
      });
    });

    // Load the rendered HTML into Puppeteer
    await page.setContent(renderedHtml,{ waitUntil: "networkidle0" });

    // Wait for the body element to ensure the page is fully loaded
    await page.waitForSelector("body");

    // Wait for the page to render and simulate a print command
    await page.evaluate(() => {
      window.print(); // This will trigger the print dialog in a browser
    });

    // Close the browser after print dialog
    await browser.close();

    res.send("Printing...");
  } catch (error) {
    next(error);
  }
};

const noOfBooks = async(req,res,next)=>{
  try{
    const count = await Book.countDocuments();

    if(count){
      res.status(200).json({message:"Record found",data:count});
    }else{
      return next(new CustomError("No record found.",404));
    }

  }catch(error){
    next(error);
  }
}

module.exports = {
  registerBook,
  getBooks,
  getBookByID,
  updateBook,
  deleteBook,
  deleteGenre,
  fetchBooksForReport,
  printReport,
  noOfBooks
};
