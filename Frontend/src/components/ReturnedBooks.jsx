import React, { useState } from 'react';
import api from '@/utils/refreshTokenInterceptor';
import { toast } from 'sonner';
import Loader from './Loader';

const returnedBooks = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    returnDate: "5 July 2025",
    dueDate: "2 July 2025"
  },
  {
    title: "1984",
    author: "George Orwell",
    returnDate: "10 July 2025",
    dueDate: "7 July 2025"
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    returnDate: "1 July 2025",
    dueDate: "28 June 2025"
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    returnDate: "3 July 2025",
    dueDate: "30 June 2025"
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    returnDate: "6 July 2025",
    dueDate: "3 July 2025"
  },
  {
    title: "Moby Dick",
    author: "Herman Melville",
    returnDate: "8 July 2025",
    dueDate: "5 July 2025"
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    returnDate: "9 July 2025",
    dueDate: "6 July 2025"
  }
];

const ReturnedBooks = ({ fetchBorrowedBooks }) => {
  const [loading, setLoading] = useState(false);

  const renewBook = async (bookId) => {
    try {
      setLoading(true);
      const response = await api.get(`/books/${bookId}/renew`, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchBorrowedBooks();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className='w-full'>
      {returnedBooks?.length > 0?
      <>
      <div className="border border-gray-200 shadow-md rounded overflow-hidden ">
      <table className="table-auto w-full text-sm">
        <thead className="bg-gray-100 text-gray-700 text-xs">
          <tr>
            <th className="p-1 text-center rounded-tl-md">Sr. No</th>
            <th className="p-1 text-center">Book Title</th>
            <th className="p-1 text-center">Author</th>
            <th className="p-1 text-center">Return Date</th>
            <th className="p-1 text-center">Due Date</th>
            <th className="p-1 text-center rounded-tr-md">Renew</th>
          </tr>
        </thead>
        <tbody>
          {returnedBooks.map((book, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-white ' : 'bg-blue-50 hover:bg-blue-100'}
            >
              <td className="p-1 text-[12px] text-center text-gray-700">{index + 1}</td>
              <td className="p-1 text-[12px] text-center">{book.title}</td>
              <td className="p-1 text-[12px] text-center">{book.author}</td>
              <td className="p-1 text-[12px] text-center">{book.returnDate}</td>
              <td className="p-1 text-[12px] text-center">{book.dueDate}</td>
              <td className="p-1  text-center">
                <button
                  onClick={() => renewBook(book._id)}
                  className="inline-flex items-center justify-center leading-none p-1 text-[10px] rounded bg-green-400 hover:bg-green-500 text-white transition-colors duration-300"
                >
                  Renew
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      </>:
      <div className='w-full h-full flex items-center justify-center text-slate-700'>
        <p>you have not returned any book</p>
      </div>}
    </div>
  );
};

export default ReturnedBooks;
