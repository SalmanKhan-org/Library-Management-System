const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const Book = require("../../models/bookModel");

// Fetch Books added by a particular librarian
exports.getAdminBooks = catchAsyncErrors(
    async (req, res) => {
        const userId = req.user._id;
        const books = await Book.find({ user: userId }).sort({ publicationDate: -1 }) // Sort by publication date in descending order;

        res.status(200).json({ success: true, books });
    } 
)