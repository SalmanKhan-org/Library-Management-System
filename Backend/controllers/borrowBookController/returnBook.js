const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const Book = require("../../models/bookModel");
const BorrowBook = require("../../models/borrowBookModel");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.returnBook = catchAsyncErrors(
    async (req, res, next) => {
        const { bookId } = req.params;
        const user = req.user;

        const book = await Book.findById(bookId.bookId._id);
        if (!book) {
            return next(new ErrorHandler("Book not found", 404));
        }

        const borrowRecord = await BorrowBook.findById(bookId);

        if(!borrowRecord){
            return next(new ErrorHandler("Issued Book not Found",404));
        }

        if(borrowRecord.total_fine !== 0){
            return next(new ErrorHandler("First Pay the Fine",400));
        }

        borrowRecord.isReturn = true;
        borrowRecord.total_fine = 0;

        await borrowRecord.save();

        res.status(200).json({
            success:true,
            message:"Book Returned Successfully"
        })
        
    }
);