import React, { useEffect, useState } from 'react';
import api from '@/utils/refreshTokenInterceptor';
import { toast } from 'sonner';
import Loader from './Loader';

const AdminDashBoard = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const recentCheckouts = borrowedBooks.filter(book => {
    const borrowDate = new Date(book.borrowDate);
    const now = new Date();
    const diffInDays = (now - borrowDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 5;
  });

  const booksDueSoon = borrowedBooks.filter(book => {
    const dueDate = new Date(book.dueDate);
    const now = new Date();
    const diffInDays = (dueDate - now) / (1000 * 60 * 60 * 24);
    return diffInDays <= 2;
  });

  const activeUsers = new Set(borrowedBooks.map(book => book.userId._id));
  console.log(borrowedBooks);


  const fetchTotalBooks = async () => {
    try {
      const response = await api.get(`/books/admin/get/all`);
      if (response.data.success) {
        setAllBooks(response.data.books);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books/admin/borrowed/get/all');
      console.log(response);
      if (response.data.success) {
        setBorrowedBooks(response.data.borrowedBooks);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
    fetchTotalBooks();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-full h-screen p-2">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-4">
        {[
          { label: "Checkout", value: borrowedBooks.length, desc: "Total Checkout" },
          { label: "My Books Readers", value: activeUsers.size, desc: "Total Active" },
          { label: "Due Soon", value: booksDueSoon.length, desc: "Due Books Soon" },
          { label: "Catalog", value: allBooks.length, desc: "Total Books" },
        ].map((item, i) => (
          <div key={i} className="p-2 text-center rounded-lg shadow-md bg-white border border-gray-200 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-600">{item.label}</h2>
            <p className="text-3xl font-bold text-emerald-600">{item.value}</p>
            <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Tables Section */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Recently Checkout Table */}
        <div className="md:w-1/2 ">
          <h2 className="font-medium text-base text-gray-700 mb-2">Recently Checked Out</h2>
          <div className="overflow-x-auto border rounded shadow-md">
            <table className="w-full text-sm table-auto">
              {recentCheckouts.length > 0 ? <>
                <thead className="bg-white text-gray-600 text-xs">
                  <tr >
                    <th className="p-1 text-center">Sr. No</th>
                    <th className="p-1  text-center">Title</th>
                    <th className="p-1  text-center">Member</th>
                  </tr>
                </thead>
              </> : <>

              </>}
              <tbody>
                {recentCheckouts.length > 0 ? (
                  recentCheckouts.map((book, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white '}
                    >
                      <td className="p-1.5 leading-none text-xs text-center">{index + 1}</td>
                      <td className="p-1.5 leading-none text-xs text-center ">{book?.bookId?.title}</td>
                      <td className="p-1.5 leading-none text-xs text-center">
                        {book.userId.firstName + ' ' + book.userId.lastName}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-1 text-xs text-center" colSpan={3}>No recent checkouts</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Books Due Soon Table */}
        <div className="md:w-1/2 ">
          <h2 className="font-semibold text-base text-gray-700 mb-2">Books Due Soon</h2>
          <div className="overflow-x-auto border rounded shadow-md">
            <table className="w-full text-sm table-auto">
              {booksDueSoon?.length > 0 && (
                <>
                <thead className="bg-white text-gray-600 text-xs">
                <tr >
                  <th className="p-1 text-center font-semibold">Sr. No</th>
                  <th className="p-1 font-semibold text-center">Title</th>
                  <th className="p-1 font-semibold text-center">Due Date</th>
                </tr>
              </thead>
                </>
              )}
              <tbody>
                {booksDueSoon.length > 0 ? (
                  booksDueSoon.map((book, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white '}
                    >
                      <td className="p-1.5 text-xs leading-none text-center">{index + 1}</td>
                      <td className="p-1.5 text-xs leading-none text-center ">{book?.bookId?.title}</td>
                      <td className="p-1.5 text-xs leading-none text-center">
                        {new Date(book?.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-1 text-xs text-center" colSpan={3}>No books due soon</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
