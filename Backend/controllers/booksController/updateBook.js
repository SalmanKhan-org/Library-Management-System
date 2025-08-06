const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const Book = require("../../models/bookModel");
const ErrorHandler = require("../../utils/ErrorHandler");
const uploadFile = require("../../utils/uploadFileOnCloudinary");

//Librarian update their book
exports.updateBook = catchAsyncErrors(
    async (req, res, next) => {
        const bookId = req.params.bookId;
        const {
            title, description, publicationDate, author, genre,
            availableCopies, isbn
        } = req.body;

        let book = await Book.findById(bookId);

        if (!book) {
            return next(new ErrorHandler("Book not found", 404));
        }
        const file = req.file;
        let imageURL;
        if (file) {
            const result = await uploadFile(file);
            imageURL = result.url;
        }

        if (title) book.title = title;
        if (description) book.description = description;
        if (publicationDate) book.publicationDate = publicationDate;
        if (author) book.author = author;
        if (genre) book.genre = genre;
        if (availableCopies) book.availableCopies = availableCopies;
        if (isbn) book.isbn = isbn;
        if (imageURL) book.image = imageURL;
        book = await book.save();
        res.status(200).json({ success: true, message: "Book updated successfully" });
    });
