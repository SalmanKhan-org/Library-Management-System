const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const BorrowBook = require("../../models/borrowBookModel");

exports.getMyBorrowedBooks = catchAsyncErrors(
    async (req, res, next) => {
        const userId = req.user._id;

        const borrowedBooks = await BorrowBook.find({ userId }).populate("bookId").populate("userId","firstName lastName").sort({ borrowDate: -1 });

        res.status(200).json({ success: true, borrowedBooks });
    }
)