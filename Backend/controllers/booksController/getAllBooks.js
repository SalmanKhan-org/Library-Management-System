const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const Book = require("../../models/bookModel");

// Fetch All Books for Admin
exports.getAllBooks = catchAsyncErrors(
    async (req, res,next) => {
        const books = await Book.find({}).populate("user",'firstName lastName');
        res.status(200).json(
            { success: true, 
                books 
            });
    });