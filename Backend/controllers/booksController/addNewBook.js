const { catchAsyncErrors } = require("../../middlewares/catchAsyncErrors");
const Book = require("../../models/bookModel");
const ErrorHandler = require("../../utils/ErrorHandler");
const uploadFile = require("../../utils/uploadFileOnCloudinary");

exports.addNewBook = catchAsyncErrors(
    async (req, res, next) => {
        const { title, description, publicationDate, author, genre, isbn } = req.body;

        const user = req?.user;

        if (!title || !description || !publicationDate || !author || !genre || !isbn) {
            return next(new ErrorHandler("All fields are required", 400));
        }

        // image and book url will come from cloudinary API
        const file = req.file;
        if (!file) {
            return next(new ErrorHandler("No file uploaded", 400));
        }
        const bookUrl = await uploadFile(file);



        const book = await Book.create({
            title,
            description,
            publicationDate,
            user,
            author,
            genre,
            isbn,
            bookUrl: bookUrl.url,
        });

        res.status(201).json({
            success: true,
            message: 'Book added successfully'
        });

    }
)