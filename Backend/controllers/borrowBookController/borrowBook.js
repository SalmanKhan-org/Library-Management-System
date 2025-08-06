const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const Book = require("../../models/bookModel");
const BorrowBook = require("../../models/borrowBookModel");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.borrowBook = catchAsyncErrors(async (req, res, next) => {
    const bookId = req.params.bookId;  
    const user = req.user;  
    const book = await Book.findById(bookId);
    if (!book) {
        return next(new ErrorHandler("Book not found", 404));
    }
    const isAlreadyBorrowed = await BorrowBook.findOne({bookId, userId:user._id, isReturn: false});
    if(isAlreadyBorrowed){
        return next(new ErrorHandler("You have already borrowed this book", 400));
    }

    // If a user already borrowed some books and has not paid their fine , don't Allow that
    // user till he pay the fine of All books
    const myBorrowedBooks = await BorrowBook.find({userId:user._id,isReturn:false});

    // check if he/she has any book without paying the fine
    myBorrowedBooks.forEach(book=>{
        if(book.total_fine !== 0){
            return next(new ErrorHandler("First Pay your fine before borrow other book",400));
        }
    })

    const borrowedBook = await BorrowBook.create({
        bookId,
        userId: user._id,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({
        success: true,
        message: "Book borrowed successfully",
    });
});