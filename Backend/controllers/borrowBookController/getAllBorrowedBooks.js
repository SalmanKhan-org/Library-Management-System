const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const BorrowBook = require("../../models/borrowBookModel");

exports.getAllBorrowedBooks = catchAsyncErrors(
    async (req, res, next) => {
        const userId = req.user._id;
        const books = await BorrowBook.find()
            .populate({
                path: 'bookId',
                match: { user: userId }, // books added by me
            })
            .populate({
                path: 'userId',
                select: 'firstName lastName email', // optional user fields
            });
        res.status(200).json({
            success: true,
            borrowedBooks: books
        })
    }
)