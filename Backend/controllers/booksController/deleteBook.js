const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const Book = require("../../models/bookModel");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.deleteBook  = catchAsyncErrors(
    async (req, res,next) => {
        const { bookId } = req.params;

        const book = await Book.findById(bookId);

        if(!book){
            return next(new ErrorHandler("Book not found", 404));
        }

        await Book.findByIdAndDelete(bookId);
        res.status(200).json({
            success:true,
            message: "Book deleted successfully"
        })

    }
)