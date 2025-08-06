import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Search } from 'lucide-react';
import BookUpload from './BookUpload';
import UpdateBook from './UpdateBook';
import api from '@/utils/refreshTokenInterceptor';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Loader from './Loader';

const AdminBooks = () => {
  const [Books, setBooks] = useState([]);
  const [booksData, setBooksData] = useState([]);
  const [openBookForm, setOpenBookForm] = useState(false);
  const [editBook, setEditBook] = useState(false);
  const [singleBook, setSingleBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState(null);
   const dropdownRef = useRef(null);

  useEffect(() => {
    const filtered = Books.filter(book =>
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery)
    );
    setBooksData(filtered);
  }, [searchQuery, Books]);

  // Fetch books from the database
  const fetchAllBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/books/admin/get/all`);
      if (response.data.success) {
        setBooks(response.data.books);
        setBooksData(response.data.books);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  //delete your book
  const deleteBook = async (bookId) => {
    try {
      const response = await api.delete(`/books/admin/${bookId}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchAllBooks();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete book");
    }
  };

  // if i click outside of dropdown, close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpenIndex(null);
      }
    };

    if (dropdownOpenIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpenIndex]);


  useEffect(() => {
    fetchAllBooks();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-full p-2 min-h-screen">
      <div className="flex justify-between mb-1 items-center">
        <div className="relative w-full md:w-[15%]">
          <input
            type="text"
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            placeholder="Search books here..."
            className="w-full border bg-white p-2 rounded text-[12px] leading-none pr-8"
          />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-gray-500" />
        </div>
        <button
          onClick={() => setOpenBookForm(true)}
          className="ml-4 p-2 inline-flex items-center justify-center leading-none text-[12px] bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors duration-300"
        >
          + Add Book
        </button>
      </div>

      <div className="overflow-x-auto border rounded shadow-md">
        <table className="w-full text-sm table-auto">
          <thead className="bg-white text-gray-600 text-xs">
            <tr>
              <th className="text-center p-1">Sr. No</th>
              <th className="text-center p-1">Title</th>
              <th className="text-center p-1">Author</th>
              <th className="text-center p-1">Genre</th>
              <th className="text-center p-1">Publication Date</th>
              <th className="text-center p-1">Edit</th>
              <th className="text-center p-1">Delete</th>
            </tr>
          </thead>
          <tbody >
            {booksData.map((book, index) => (
              <tr
                key={book._id}
                className={index % 2 !== 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 '}
              >
                <td className="p-1 text-center text-xs">{index + 1}</td>
                <td className="text-center p-1 text-xs font-medium">{book.title}</td>
                <td className="text-center p-1 text-xs">{book.author}</td>
                <td className="text-center p-1 text-xs">{book.genre}</td>
                <td className="text-center p-1 text-xs">{format(new Date(book.publicationDate), "MMMM dd, yyyy")}</td>
                <td className="text-center p-1 ">
                  <button
                    onClick={() => {
                          setSingleBook(book);
                          setEditBook(true);
                        }}
                    className="inline-flex items-center justify-center leading-none text-[10px] p-1 rounded bg-amber-500 hover:bg-amber-600 text-white transition-colors duration-300"
                  >
                    Edit
                    {/* <HiOutlineDotsVertical className='w-3 h-3' /> */}
                  </button>
                  {/* {dropdownOpenIndex === index && (
                    <div ref={dropdownRef} className={`absolute right-3  ${index < booksData.length-3 ? 'top-1':'bottom-1'} mt-1 w-20 z-10 bg-gray-900 text-white text-sm rounded shadow`}>
                      <div
                        onClick={() => {
                          setSingleBook(book);
                          setEditBook(true);
                          setDropdownOpenIndex(null);
                        }}
                        className="flex items-center gap-1 p-1 text-sm cursor-pointer hover:bg-gray-800"
                      >
                        <FaEdit className='w-3 h-3' /> Edit
                      </div>
                      <div
                        onClick={() => {
                          deleteBook(book._id);
                          setDropdownOpenIndex(null);
                        }}
                        className="flex items-center gap-1 p-1 text-sm cursor-pointer hover:bg-gray-800"
                      >
                        <MdDeleteForever className='w-3 h-3' /> Delete
                      </div>
                    </div>
                  )} */}
                </td>
                <td className="text-center p-1 ">
                    <button
                    onClick={() => {
                          deleteBook(book._id);
                        }}
                     className="text-[10px] leading-none inline-flex items-center justify-center p-1 rounded bg-red-600 hover:bg-red-700 text-white transition-colors duration-300"
                    >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openBookForm && (
        <BookUpload fetchAllBooks={fetchAllBooks} onClose={() => setOpenBookForm(false)} />
      )}
      {editBook && (
        <UpdateBook
          book={singleBook}
          fetchAllBooks={fetchAllBooks}
          onClose={() => setEditBook(false)}
        />
      )}
    </div>
  );
};

export default AdminBooks;
