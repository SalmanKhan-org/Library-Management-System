import React, { useState } from 'react';
import { format } from 'date-fns';
import calculateFine from '@/utils/calculateFine';
import { toast } from 'sonner';
import BookReader from './BookReader';
import { LiaRupeeSignSolid } from "react-icons/lia";
import api from '@/utils/refreshTokenInterceptor';

const BorrowedBooks = ({ borrowedBooks, fetchBorrowedBooks }) => {
  const [readBook, setReadBook] = useState(false);
  const [currentBook, setCurrentBook] = useState("");

  const payFine = async (bookId, fine) => {
    if (fine === 0) {
      toast.success('No fine to pay!');
      return;
    }
    try {
      const response = await api.get(`/books/${bookId}/pay-fine`);
      if(response?.data.success){
        toast.success(response?.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  //return book
  const handleReturnBook = async(bookId)=>{
    try {
      const response = await api.get(`/books/${bookId}/return`);
      if(response.data.success){
        fetchBorrowedBooks();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="w-full">
      {borrowedBooks?.length > 0 ? 
      <>
      <div className="border border-gray-300 rounded overflow-hidden shadow-sm bg-white">
        <table className="w-full text-sm table-auto">
          <thead className="bg-white  text-xs">
            <tr className='text-gray-600'>
              <th className="text-center p-1">Sr. No</th>
              <th className="text-center p-1">Book Title</th>
              <th className="text-center p-1">Borrow Date</th>
              <th className="text-center p-1">Due Date</th>
              <th className=" flex items-center justify-center p-1">Fine in (<span><LiaRupeeSignSolid/></span>)</th>
              <th className="text-center p-1">Return Book</th>
              <th className="text-center p-1">Pay Fine</th>
              <th className="text-center p-1">Read Book</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((book, index) => (
              <tr
                key={index}
                className={index % 2 !== 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 '}
              >
                <td className="p-1 text-xs text-center text-gray-700">{index + 1}</td>
                <td className="p-1 text-xs text-center">
                  {book?.bookId?.title || "Not Available"}
                </td>
                <td className="p-1 text-xs text-center">
                  {format(book?.borrowDate, "MMM dd, yyyy")}
                </td>
                <td className="p-1 text-xs text-center">
                  {format(book?.dueDate, "MMM dd, yyyy")}
                </td>
                <td className="p-1 text-xs text-center">
                  {calculateFine(book?.borrowDate, book.dueDate)}
                </td>
                <td className="p-1 text-center">
                  <button onClick={()=>handleReturnBook(book._id)} className="inline-flex items-center justify-center leading-none p-1 text-[10px] rounded bg-green-400 hover:bg-green-500 text-white transition-colors duration-300">
                    Return
                  </button>
                </td>
                <td className="p-1 text-center">
                  {!book.finePaid ? (
                    <button
                      onClick={() =>
                        payFine(book._id, calculateFine(book?.borrowDate, book.dueDate))
                      }
                      className="inline-flex items-center justify-center leading-none p-1 text-[10px] rounded bg-amber-500 hover:bg-amber-600 text-white transition-colors duration-300"
                    >
                      Pay
                    </button>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center justify-center leading-none p-1 text-[10px] rounded bg-gray-200 text-gray-700 transition-colors duration-300"
                    >
                      Fine Paid
                    </button>
                  )}
                </td>
                <td className="p-1 text-center">
                  <button
                    onClick={() => {
                      setReadBook(true);
                      setCurrentBook(book?.bookId?.bookUrl);
                    }}
                    className="inline-flex items-center justify-center leading-none p-1 text-[10px] rounded bg-green-500 hover:bg-green-600 text-white"
                  >
                    Read
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>:
      <div className='w-full flex items-center justify-center text-slate-700'>
        <p>You don't have any books borrowed yet</p>
      </div>}

      {readBook && (
        <BookReader pdfUrl={currentBook} onClose={() => setReadBook(false)} />
      )}
    </div>
  );
};

export default BorrowedBooks;
