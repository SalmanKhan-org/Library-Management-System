import React, { useEffect, useState } from 'react'
import { FaBookReader, FaRegUser } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaBookOpen } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import api from '@/utils/refreshTokenInterceptor';
import { toast } from 'sonner';
import Loader from './Loader';
import { format } from 'date-fns';
import axios from 'axios';

const upcoming_books = [
  {
    "title": "The Silent Codex",
    "author": "Elena Marlowe",
    "releaseDate": "02 August 2025",
    "genre": "Mystery Thriller",
    "description": "A gripping tale of a librarian who discovers a hidden code in an ancient manuscript."
  },
  {
    "title": "Through Digital Eyes",
    "author": "Rajiv Mehta",
    "releaseDate": "10 August 2025",
    "genre": "Science Fiction",
    "description": "Set in a future where AI governs reality, a hacker seeks truth beyond the algorithm."
  },
  {
    "title": "The Willow’s Secret",
    "author": "Catherine Bloom",
    "releaseDate": "15 August 2025",
    "genre": "Historical Romance",
    "description": "A love story tangled in the vines of 18th-century England’s most scandalous secrets."
  },
  {
    "title": "Codebreakers of the Forgotten World",
    "author": "Isaac Yuen",
    "releaseDate": "20 August 2025",
    "genre": "Adventure / Fantasy",
    "description": "A team of explorers uncover an ancient language that could rewrite history."
  },
  {
    "title": "Mind Garden",
    "author": "Anika Deshmukh",
    "releaseDate": "28 August 2025",
    "genre": "Psychological Fiction",
    "description": "A deep dive into the subconscious of a woman battling memory loss and fractured reality."
  }
]


const Home = () => {
  const { user } = useSelector(state => state?.user);
  const [recentCheckouts, setRecentCheckouts] = useState([]);
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

  // Fetch borrowed books from the backend API
  const fetchRecentCheckout = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/books/recent-checkouts`);
      console.log(response);
      if (response.data.success) {
        setLoading(false);
        setRecentCheckouts(response.data.recentCheckout);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecentCheckout();
  }, [])
  if (loading) return <Loader />
  return (
    <div className="w-full p-2  min-h-screen">
      {/* Greeting box for user */}
      <div className='flex p-2 rounded-xl items-center justify-between bg-gradient-to-r from-emerald-500 to-emerald-700 text-white mb-2'>
        <div>
          <h1 className='text-lg font-semibold'>Welcome Back, {user?.firstName + ' ' + user?.lastName}</h1>
          <p className='text-xs'>You have {borrowedBooks?.length || 0} books currently Checked Out</p>
        </div>
        <div className=''>
          {/* <span className='p-4 h-full w-full rounded-md bg-green-200'><FaBookReader className='text-white text-lg' /></span> */}
          <p className='p-2 bg-green-300 rounded-md'><FaBookReader className='text-white text-lg' /></p>
        </div>
      </div>
      {/* Quick Actions */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-2'>
        <Link to={'/books'} className='bg-white flex items-center flex-col hover:bg-emerald-50 p-4 shadow rounded-lg cursor-pointer transition'>
          <i><FaSearch className='text-emerald-500 text-xl mb-2' /></i>
          <p className='font-medium text-black/70'>Search Catalog</p>
        </Link>
        <Link to={'/borrowed/books'} className='bg-white flex items-center flex-col hover:bg-emerald-50 p-4 shadow rounded-lg cursor-pointer transition'>
          <i><FaBookOpen className='text-blue-500 text-xl mb-2' /></i>
          <Link to={'/borrowed/books'} className='font-medium text-black/70'>My Books</Link>
        </Link>
        {user && user?.role === 'Librarian' && (
          <Link to={'/admin/books'} className='bg-white flex items-center flex-col hover:bg-emerald-50 p-4 shadow rounded-lg cursor-pointer transition'>
            <i><FaBookOpen className='text-blue-500 text-xl mb-2' /></i>
            <Link to={'/admin/books'} className='font-medium text-black/70'>My Books</Link>
          </Link>
        )}
        <Link to={'/user/profile'} className='bg-white flex items-center flex-col hover:bg-emerald-50 p-4 shadow rounded-lg cursor-pointer transition'>
          <i><FaRegUser className='text-blue-500 text-xl mb-2' /></i>
          <Link className='font-medium text-black/70'>Profile</Link>
        </Link>
        <Link to={'/borrowed/books'} className='bg-white flex items-center flex-col hover:bg-emerald-50 p-4 shadow rounded-lg cursor-pointer transition'>
          <MdOutlineAccessTimeFilled className='text-blue-500 text-xl mb-2' />
          <Link to={'/borrowed/books'} className='font-medium text-black/70'>Due Soon</Link>
        </Link>
      </div>
      {/* Currenly Checkouts */}
      <div className='w-full mt-2'>
        <h1 className='font-medium text-slate-700'>Recently Borrowed Books</h1>
        {recentCheckouts?.length > 0 ?
          <>
            <div className="border border-gray-300 rounded-md overflow-hidden shadow-sm bg-white">
              <table className="w-full text-sm table-auto">
                <thead className="bg-white text-gray-600 text-xs">
                  <tr>
                    <th className="text-center p-1">Sr. No</th>
                    <th className="text-center p-1">User</th>
                    <th className="text-center p-1">Book Title</th>
                    <th className="text-center p-1">Book Author</th>
                    <th className="text-center p-1">Book Category</th>
                    <th className="text-center p-1">Borrow Date</th>
                    <th className="text-center p-1">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCheckouts.map((book, index) => (
                    <tr
                      key={index}
                      className={index % 2 !== 0 ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white '}
                    >
                      <td className="p-1 text-xs text-center text-gray-600">{index + 1}</td>
                      <td className="p-1 text-xs text-center">
                        {book?.userId?.firstName + ' ' + book?.userId?.lastName || "Not Available"}
                      </td>
                      <td className="p-1 text-xs text-center">
                        {book?.bookId?.title || "Not Available"}
                      </td>
                      <td className="p-1 text-xs text-center">
                        {book?.bookId?.author || "Not Available"}
                      </td>
                      <td className="p-1 text-xs text-center">
                        {book?.bookId?.genre || "Not Available"}
                      </td>
                      <td className="p-1 text-xs text-center">
                        {format(book?.borrowDate, "MMMM dd, yyyy")}
                      </td>
                      <td className="p-1 text-xs text-center">
                        {format(book?.dueDate, "MMMM dd, yyyy")}
                      </td>

                      {/* <td className="p-1 text-center">
                        <button className="inline-flex items-center justify-center leading-none p-1 text-[10px] rounded bg-green-400 hover:bg-green-500 text-white transition-colors duration-300">
                          Return
                        </button>
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
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </> :
          <div className='w-full flex items-center justify-center text-slate-700'>
            <p>You don't have any books borrowed yet</p>
          </div>}
      </div>
      {/* New Arrivals */}
      <div className='w-full mt-2'>
        <h1 className='font-medium text-slate-700'>Upcoming Books</h1>
        {upcoming_books?.length > 0 ?
          <>
            <div className="border border-gray-300 rounded-md overflow-hidden shadow-sm bg-white">
              <table className="w-full text-sm table-auto">
                <thead className="bg-white text-gray-600 text-xs">
                  <tr>
                    <th className="text-center p-1">Sr. No</th>
                    <th className="text-center p-1">Book Title</th>
                    <th className="text-center p-1">Author</th>
                    <th className="text-center p-1">Category</th>
                    <th className="text-center p-1">Release Date</th>
                  </tr>
                </thead>
                <tbody>
                  {upcoming_books.map((book, index) => (
                    <tr
                      key={index}
                      className={index % 2 !== 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 '}
                    >
                      <td className="p-1 text-xs text-center text-gray-700">{index + 1}</td>
                      <td className="p-1 text-xs text-center">
                        {book?.title || "Not Available"}
                      </td>
                      <td className="p-1 text-xs text-center">
                        {book.author}
                      </td>
                      <td className="p-1 text-xs text-center">
                        {book?.genre}
                      </td>

                      <td className="p-1 text-center text-xs">
                        {book.releaseDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </> :
          <div className='w-full flex items-center justify-center text-slate-700'>
            <p>No Upcoming Books</p>
          </div>}
      </div>
      {/* {readBook && (
        <BookReader pdfUrl={currentBook} onClose={() => setReadBook(false)} />
      )} */}
    </div>
  )
}

export default Home
