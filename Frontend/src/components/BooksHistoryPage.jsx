import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import BorrowedBooks from './BorrowedBooks'
import ReturnedBooks from './ReturnedBooks'
import api from '@/utils/refreshTokenInterceptor'
import { toast } from 'sonner'
import Loader from './Loader'


const BooksHistoryPage = () => {
    const [booksToggle, setBooksToggle] = useState(true);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch borrowed books from the backend API
    const fetchBorrowedBooks = async()=>{
        try{
            setLoading(true);
            const response = await api.get('/books/borrowed/get/all');
            if(response.data.success){
                setLoading(false);
                setBorrowedBooks(response.data.borrowedBooks);
            }
        }catch(error){
            toast.error(error.response?.data?.message);
        }finally{
            setLoading(false);
        }
    }

    

    useEffect(()=>{
        fetchBorrowedBooks();
    }, [])
    if(loading) return <Loader/>
    return (
        <div className='w-full h-screen p-2'>
            <div className='flex gap-2'>
                <button 
                onClick={()=>setBooksToggle(true)}
                className='p-1.5 inline-flex items-center justify-center leading-none  text-[11px] rounded-sm bg-[#059669] text-white hover:bg-[#047857] transition-colors duration-300'
                >Borrowed Books</button>
                <button 
                className='p-1.5 inline-flex items-center justify-center leading-none text-[11px] border rounded-sm bg-green-400 text-white hover:bg-green-500 transition-colors duration-300'
                onClick={()=>setBooksToggle(false)}>Returned Books</button>
            </div>
            <div className='mt-2 w-full'>
                {booksToggle? (<BorrowedBooks borrowedBooks={borrowedBooks} fetchBorrowedBooks={fetchBorrowedBooks} />):(<ReturnedBooks returnedBooks={borrowedBooks} fetchBorrowedBooks={fetchBorrowedBooks} />)}
            </div>
        </div>
    )
}

export default BooksHistoryPage
