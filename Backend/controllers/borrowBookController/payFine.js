const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const BorrowBook = require("../../models/borrowBookModel");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.payFine = catchAsyncErrors(
    async(req,res,next)=>{
        const {bookId} = req.params;

        const borrowRecord = await BorrowBook.findById(bookId);

        if(!borrowRecord) return next(new ErrorHandler("Issued book not found",404));

        // Add a payment App
        // const isPaid = await payFineUsingStripe();
        
    }
)