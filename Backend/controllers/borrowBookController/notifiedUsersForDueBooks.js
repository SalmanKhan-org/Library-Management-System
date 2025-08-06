const BorrowBook = require("../../models/borrowBookModel");
const { sendEmail } = require("../../utils/sendEmail");

exports.notifiedUserForDueBooks = async() => {
    const borrowedBooks = await BorrowBook.find({isReturn : false});

    // Send notification to users whose books are due within 2 days
    borrowedBooks.forEach(async(book) => {
        const dueDate = new Date(book.dueDate);
        const currentDate = new Date();
        const daysRemaining = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));
        if (daysRemaining <= 2) {
            await sendEmail(book, book.userId, daysRemaining);
        }
    });
}
