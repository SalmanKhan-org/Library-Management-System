const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const Book = require("../../models/bookModel");
const BorrowBook = require("../../models/borrowBookModel");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.renewBook = catchAsyncErrors(
    async (req, res, next) => {
        const { bookId } = req.params;
        const user = req.user;

        //find BorrowBook document
        const borrowRecord = await BorrowBook.findById(bookId);

        if (!borrowRecord) {
            return next(new ErrorHandler('Borrow record not found', 404));
        }

        if (!borrowRecord.isReturn) {
            return next(new ErrorHandler('Book is already borrowed. Return it before renewing', 400));
        }


        borrowRecord.borrowDate = new Date(Date.now());
        borrowRecord.dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

        borrowRecord.isReturn = false;
        borrowRecord.finePaid = false;

        await borrowRecord.save();

        res.status(200).json({ success: true, message: 'Book renewed successfully' });
        
    }
)