const mongoose = require('mongoose');


const borrowSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrowDate: { type: Date, required: true, default: Date.now },
    returnDate: { type: Date }, // when book was actually returned
    dueDate: { type: Date, required: true }, // date it should have been returned
    isReturn: { type: Boolean, default: false },
    total_fine: { type: Number, default: 0 },
});

const BorrowBook = mongoose.model('BorrowBook', borrowSchema);
module.exports = BorrowBook;
