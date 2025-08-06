import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Assuming these UI components are well-styled or accept Tailwind/CSS classes
import { Card } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { IoMdClose } from 'react-icons/io'; // Close icon
import { Loader2 } from 'lucide-react'; // Loading spinner icon
import { toast } from 'sonner'; // Toast notifications
import api from '@/utils/refreshTokenInterceptor'; // Your API interceptor
import axios from 'axios'; // For direct axios call, though `api` is preferred.

// 📦 Form Schema - No changes needed here, it's perfect.
const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title cannot exceed 100 characters"),
    author: z.string().min(2, "Author must be at least 2 characters").max(100, "Author cannot exceed 100 characters"),
    genre: z.string().min(2, "Genre must be at least 2 characters").max(100, "Genre cannot exceed 100 characters"),
    publicationDate: z.coerce.date({ required_error: 'Publication Date is required' }),
    description: z.string().min(2, "Description must be at least 2 characters"),
    isbn: z.string().optional().or(z.literal('')), // Make ISBN optional and handle empty string
    bookFile: z.any() // Changed 'image' to 'bookFile' to be more descriptive for a PDF
        .refine(file => file instanceof File, "Book file is required.") // Ensure it's a File object
        .refine(file => file.size <= 5 * 1024 * 1024, `File size should be less than 5MB.`) // Example: 5MB limit
        .refine(file => file.type === "application/pdf", "Only PDF files are allowed."),
});


const BookUpload = ({ fetchAllBooks, onClose }) => {
   
    const [bookFile, setBookFile] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            author: "",
            genre: "",
            isbn: "",
            publicationDate: new Date().toISOString().split('T')[0], // Set default to today's date in YYYY-MM-DD format
            description: "",
            bookFile: undefined // Field name changed from 'image'
        }
    });

    // handle book file change
    const handleBookFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBookFile(file);
        }
    };

    const onSubmit = async (values) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("author", values.author);
        formData.append("genre", values.genre);
        formData.append("publicationDate", values.publicationDate.toISOString());
        formData.append("description", values.description);
        formData.append("isbn", values.isbn || ''); // Ensure ISBN is not 'undefined' if optional
        formData.append("bookUrl", bookFile); // Use the state variable `bookFile`

        try {
            // Using your `api` interceptor for consistency with token handling
            const response = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/books/add/new`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                fetchAllBooks(); // Refresh book list
                onClose(); // Close the modal/component
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message || "An unknown error occurred.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to upload book. Please try again.");
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-70 backdrop-blur-sm p-4 overflow-y-auto'>
            <Card className='relative w-full max-w-md bg-white text-gray-900 border border-gray-200 shadow-xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]'>
                <div className='flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50'>
                    <h2 className="text-xl font-semibold text-gray-800">Add New Book</h2>
                    <button
                        onClick={onClose}
                        className='p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200'
                        aria-label="Close"
                    >
                        <IoMdClose className='h-5 w-5' />
                    </button>
                </div>

                <div className='p-4 overflow-y-auto overflow-x-hidden flex-1'> {/* Added flex-1 to make this scrollable */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/** Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Book Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter book title"
                                                {...field}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                    </FormItem>
                                )}
                            />

                            {/** Author */}
                            <FormField
                                control={form.control}
                                name="author"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Book Author</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter author name"
                                                {...field}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                    </FormItem>
                                )}
                            />

                            {/** Genre */}
                            <FormField
                                control={form.control}
                                name="genre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Book Category</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter category"
                                                {...field}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                    </FormItem>
                                )}
                            />

                            {/** ISBN */}
                            <FormField
                                control={form.control}
                                name="isbn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">ISBN (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type={'text'}
                                                placeholder="Enter ISBN"
                                                {...field}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                    </FormItem>
                                )}
                            />

                            {/** Publication Date */}
                            <FormField
                                control={form.control}
                                name="publicationDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Publication Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                                                onChange={(e) => field.onChange(new Date(e.target.value))}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                    </FormItem>
                                )}
                            />

                            {/** Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter book description"
                                                {...field}
                                                rows={4}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm resize-y"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                    </FormItem>
                                )}
                            />

                            {/** Book File Upload */}
                            <FormField
                                control={form.control}
                                name="bookFile" // Updated name
                                render={({ field: { onChange, ref} }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Upload Book (PDF)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                accept="application/pdf"
                                                onChange={(e) => {
                                                    handleBookFileChange(e); // Update local state for `bookFile`
                                                    onChange(e.target.files[0]); // Update form state
                                                }}
                                                ref={ref}
                                                className="mt-1 block w-full text-sm text-gray-500
                                                           file:mr-4 file:py-2 file:px-4
                                                           file:rounded-md file:border-0
                                                           file:text-sm file:font-semibold
                                                           file:bg-gray-100 file:text-gray-700
                                                           hover:file:bg-gray-200 transition-colors duration-200"
                                            />
                                        </FormControl>
                                        {bookFile && (
                                            <p className="mt-2 text-sm text-gray-600">Selected file: <span className="font-semibold">{bookFile.name}</span></p>
                                        )}
                                        <FormMessage className="text-red-500 text-xs mt-1" />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end pt-4 border-t border-gray-200 -mx-6 px-6"> {/* Consistent padding */}
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-900 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-900 transition-colors duration-200"
                                >
                                    {form.formState.isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Upload Book
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default BookUpload;