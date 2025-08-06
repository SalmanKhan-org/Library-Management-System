const express = require('express');
const { addNewBook } = require('../controllers/booksController/addNewBook');
const { deleteBook } = require('../controllers/booksController/deleteBook');
const { getAllBooks } = require('../controllers/booksController/getAllBooks');
const { getAdminBooks } = require('../controllers/booksController/getAdminBooks');
const { authenticateToken, isAdmin } = require('../middlewares/authToken');
const upload = require('../middlewares/multer');
const { borrowBook } = require('../controllers/borrowBookController/borrowBook');
const { updateBook } = require('../controllers/booksController/updateBook');
const { getMyBorrowedBooks } = require('../controllers/borrowBookController/getMyBorrowedBooks');
const { renewBook } = require('../controllers/borrowBookController/renewBook');
const { getAllBorrowedBooks } = require('../controllers/borrowBookController/getAllBorrowedBooks');
const { recentlyCheckouts } = require('../controllers/borrowBookController/recentlyCheckouts');
const { returnBook } = require('../controllers/borrowBookController/returnBook');
const router = express.Router();

router.post('/add/new',authenticateToken, isAdmin, upload.single('bookUrl'),  addNewBook);
router.get('/recent-checkouts', recentlyCheckouts);
router.get('/admin/get/all',authenticateToken, isAdmin, getAdminBooks);
router.get('/get/all',getAllBooks);
router.get('/borrowed/get/all', authenticateToken, getMyBorrowedBooks);
router.get('/admin/borrowed/get/all', authenticateToken, isAdmin, getAllBorrowedBooks);
router
    .delete('/admin/:bookId',authenticateToken,isAdmin,  deleteBook)
    .put('/admin/:bookId', authenticateToken, isAdmin, upload.single('bookUrl'),  updateBook);

// borrow book routes
router.get('/:bookId/borrow', authenticateToken, borrowBook);
router.get('/:bookId/renew', authenticateToken, renewBook);
router.get('/:bookId/return',returnBook);



module.exports = router;