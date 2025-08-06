import React, { useEffect, useRef, useState } from 'react';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Search } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/utils/refreshTokenInterceptor';
import { toast } from 'sonner';
import Loader from './Loader';

const Catalog = () => {
    const [Books, setBooks] = useState([]);
    const [booksData, setBooksData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [dropdownOpenIndex, setDropdownOpenIndex] = useState(null);
    const dropdownRef = useRef(null);

    // Search filter
    useEffect(() => {
        //Debouncing Search
        // setTimeout(() => {
        //     const filtered = Books.filter(book =>
        //         book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        //         book.author.toLowerCase().includes(searchQuery.toLowerCase())
        //     );
        //     setBooksData(filtered);
        // }, 2000);
        const filtered = Books.filter(book =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setBooksData(filtered);
    }, [searchQuery, Books]);

    // Fetch books
    const fetchBooks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/books/get/all');
            if (res.data.success) {
                setBooks(res.data.books);
                setBooksData(res.data.books);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Borrow handler
    const borrowBook = async (bookId) => {
        try {
            const res = await api.get(`/books/${bookId}/borrow`);
            if (res.data.success) {
                toast.success(res.data.message);
                fetchBooks();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpenIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) return <Loader />;
    return (
        <div className="w-full p-2 h-screen">
            <div className='flex justify-between items-center mb-2'>
                <h1 className='text-base font-semibold'>List of Books Available in Library</h1>
                <div className="relative w-[15%]">
                    <input
                        type="text"
                        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                        placeholder="Search books here..."
                        className="w-full border bg-white p-2 leading-none rounded text-[12px] pr-8"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-gray-500" />
                </div>
            </div>
            <div className="overflow-auto border rounded shadow">
                <table className="w-full table-auto text-sm">
                    <thead className="bg-white text-gray-600 text-xs">
                        <tr>
                            <th className="p-1 text-center">Sr. No</th>
                            <th className="p-1 text-center">Title</th>
                            <th className="p-1 text-center">Author</th>
                            <th className="p-1 text-center">Genre</th>
                            <th className="p-1 text-center">Publication Date</th>
                            <th className="p-1 text-center">Borrow Book</th>
                        </tr>
                    </thead>
                    <tbody>
                        {booksData.map((book, index) => (
                            <tr
                                key={index}
                                className={index % 2 !== 0 ? "bg-white " : "bg-blue-50 hover:bg-blue-100"}
                            >
                                <td className="p-1 text-xs  text-center text-gray-700">{index + 1}</td>
                                <td className="p-1 text-xs  text-center">{book.title}</td>
                                <td className="p-1 text-xs  text-center">{book.author}</td>
                                <td className="p-1  text-xs text-center">{book.genre}</td>
                                <td className="p-1  text-xs text-center">{format(new Date(book.publicationDate), "dd MMMM yyyy")}</td>
                                <td className="p-1  text-xs text-center">
                                    <button
                                        onClick={() => {
                                            borrowBook(book._id);
                                        }}
                                        className="inline-flex items-center justify-center leading-none p-1 text-[10px] rounded bg-green-400 hover:bg-green-500 text-white"
                                    >
                                        Borrow
                                    </button>

                                    {/* {dropdownOpenIndex === index && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute right-2 top-7 w-28 z-10 bg-black text-white text-sm rounded shadow-md"
                                        >
                                            <div
                                                onClick={() => {
                                                    borrowBook(book._id);
                                                    setDropdownOpenIndex(null);
                                                }}
                                                className="px-3 py-2 cursor-pointer hover:bg-gray-800"
                                            >
                                                Borrow
                                            </div>
                                            <div
                                                onClick={() => setDropdownOpenIndex(null)}
                                                className="px-3 py-2 cursor-pointer hover:bg-gray-800"
                                            >
                                                More Info
                                            </div>
                                        </div>
                                    )} */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Catalog;
