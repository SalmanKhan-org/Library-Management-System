import React, { useEffect, useState } from 'react';
import UserProfileForm from './updateUserProfile';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { FaBookReader, FaBook, FaUndo } from 'react-icons/fa';
import Loader from './Loader';
import { format } from 'date-fns';
import api from '@/utils/refreshTokenInterceptor';
import getBookStatus from '@/utils/returnStatus';

const booksHistory = [
  {
    bookTitle: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    borrowDate: '2025-06-20',
    dueDate: '2025-07-04',
    status: 'Overdue',
  },
  {
    bookTitle: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    borrowDate: '2025-07-01',
    dueDate: '2025-07-15',
    status: 'DueSoon',
  },
  {
    bookTitle: '1984',
    author: 'George Orwell',
    borrowDate: '2025-06-10',
    dueDate: '2025-06-24',
    status: 'Returned',
  },
  {
    bookTitle: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    borrowDate: '2025-06-28',
    dueDate: '2025-07-12',
    status: 'Borrowed',
  },
  {
    bookTitle: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    borrowDate: '2025-06-25',
    dueDate: '2025-07-09',
    status: 'DueSoon',
  },
  {
    bookTitle: 'Atomic Habits',
    author: 'James Clear',
    borrowDate: '2025-07-05',
    dueDate: '2025-07-19',
    status: 'Borrowed',
  },
  {
    bookTitle: 'The Alchemist',
    author: 'Paulo Coelho',
    borrowDate: '2025-06-15',
    dueDate: '2025-06-29',
    status: 'Overdue',
  },
  {
    bookTitle: 'Educated',
    author: 'Tara Westover',
    borrowDate: '2025-07-03',
    dueDate: '2025-07-17',
    status: 'Borrowed',
  },
];

const Profile = () => {
  const { user } = useSelector((state) => state?.user);
  const [isUpdateUser, setIsUpdateUser] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  // Fetch borrowed books from the backend API
  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books/borrowed/get/all');
      if (response.data.success) {
        setLoading(false);
        setBorrowedBooks(response.data.borrowedBooks);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchBorrowedBooks();
  }, [])

  const recentCheckouts = borrowedBooks.filter(book => {
    const borrowDate = new Date(book.borrowDate);
    const now = new Date();
    const diffInDays = (now - borrowDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 3;
  });

  const returnedBooks = borrowedBooks.filter((book)=>book.isReturn);

  const statusColorMap = {
    Overdue: 'bg-red-100 text-red-700',
    Due_Soon: 'bg-yellow-100 text-yellow-700',
    Returned: 'bg-green-100 text-green-700',
    Borrowed: 'bg-blue-100 text-blue-700',
  };
  if(loading) return <Loader/>
  return (
    <div className="w-full min-h-screen  p-2  ">
      {/* Cards */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <FaBookReader className="text-indigo-500 text-2xl" />
          <h2 className="font-semibold">Currently Reading</h2>
          <p className="text-2xl font-bold text-indigo-600">{borrowedBooks?.length}</p>
          <p className="text-sm text-gray-500">Active Books</p>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <FaBook className="text-teal-500 text-2xl" />
          <h2 className="font-semibold">Borrowed Books</h2>
          <p className="text-2xl font-bold text-teal-600">{borrowedBooks?.length}</p>
          <p className="text-sm text-gray-500">Total Borrowed</p>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow hover:shadow-md transition">
          <FaUndo className="text-emerald-500 text-2xl" />
          <h2 className="font-semibold">Returned Books</h2>
          <p className="text-2xl font-bold text-emerald-600">{returnedBooks?.length}</p>
          <p className="text-sm text-gray-500">Total Returned</p>
        </div>
      </div>

      {/* Borrow History */}
      <div className="">
        <h1 className="text-base font-semibold text-gray-700 my-2 ">Recent Borrow History</h1>
        {recentCheckouts?.length > 0 ? <>
        <div className="overflow-x-auto bg-white rounded shadow border border-gray-200">
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-gray-100 text-gray-700 text-xs">
              <tr>
                <th className="p-1 text-left rounded-tl-lg">Sr. No</th>
                <th className="p-1 text-center">Book Title</th>
                <th className="p-1 text-center">Author</th>
                <th className="p-1 text-center">Borrow Date</th>
                <th className="p-1 text-center">Due Date</th>
                <th className="p-1 text-center rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCheckouts?.map((book, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50 hover:bg-gray-100 transition'}
                >
                  <td className="p-1 text-xs text-left text-gray-700">{index + 1}</td>
                  <td className="p-1 text-xs text-center">{book?.bookId?.title}</td>
                  <td className="p-1 text-xs text-center">{book?.bookId?.author}</td>
                  <td className="p-1 text-xs text-center">{format(book?.borrowDate,"MMMM dd, yyyy")}</td>
                  <td className="p-1 text-xs text-center">{format(book?.dueDate,"MMMM dd, yyyy")}</td>
                  <td className="p-1  text-center">
                    <button
                      className={`inline-flex items-center justify-center leading-none p-1 rounded text-xs font-medium ${statusColorMap[getBookStatus(book?.dueDate)] || 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {getBookStatus(book?.dueDate)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>:<div className='w-full text-slate-700 flex items-center justify-center'>
          <p>You don't have any books Borrowed </p>
        </div>}
        <div className="w-full flex justify-end mt-2">
          <button
            onClick={() => setIsUpdateUser(true)}
            className="inline-flex items-center justify-center leading-none p-1 text-[11px] bg-indigo-600  hover:bg-indigo-700 text-white rounded  shadow transition-colors duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {isUpdateUser && <UserProfileForm user={user} onClose={() => setIsUpdateUser(false)} />}
    </div>
  );
};

export default Profile;
