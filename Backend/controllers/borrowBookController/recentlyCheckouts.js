const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const BorrowBook = require("../../models/borrowBookModel");

exports.recentlyCheckouts = catchAsyncErrors(async (req, res, next) => {
    // Get time 2 hours ago
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    const recentCheckout = await BorrowBook.find({
        borrowDate: { $gte: twoHoursAgo }
    }).populate('bookId userId'); // Optional: populate related data

    res.status(200).json({
        success: true,
        recentCheckout
    });
});
