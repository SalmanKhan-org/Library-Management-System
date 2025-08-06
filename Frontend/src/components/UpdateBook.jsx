import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from './ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { IoMdClose } from 'react-icons/io';
import { Textarea } from './ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

// Schema
const formSchema = z.object({
  title: z.string().min(2).max(100),
  author: z.string().min(2).max(100),
  genre: z.string().min(2).max(100),
  publicationDate: z.coerce.date(),
  description: z.string().min(2),
  isbn: z.string(),
  availableCopies: z.coerce.number().int().min(0),
});

const UpdateBook = ({ book, fetchAllBooks, onClose }) => {
  const [preview, setPreview] = useState(book?.image || null);
  const [file, setFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: book?.title || '',
      author: book?.author || '',
      genre: book?.genre || '',
      isbn: book?.isbn || '',
      publicationDate: book?.publicationDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      description: book?.description || '',
      availableCopies: book?.availableCopies || 0,
    },
  });

  // Handle file input
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (key === 'publicationDate') {
        formData.append(key, new Date(val).toISOString());
      } else {
        formData.append(key, val);
      }
    });
    if (file) formData.append('image', file);

    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/books/admin/${book._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (res.data.success) {
        fetchAllBooks();
        onClose();
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="w-full h-screen fixed inset-0 z-50 bg-black/50 flex justify-center items-center overflow-hidden">
      <div className="w-full max-w-md relative">
        <Card className="p-4 w-full max-w-md max-h-screen overflow-y-auto">
          <div className="w-full p-2 flex justify-between">
            <h2 className="text-xl font-bold">Update Book</h2>
            <span onClick={onClose} className="text-lg p-2 cursor-pointer">
              <IoMdClose />
            </span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter book title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Author */}
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Genre */}
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ISBN */}
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ISBN</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ISBN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Publication Date */}
              <FormField
                control={form.control}
                name="publicationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Available Copies */}
              <FormField
                control={form.control}
                name="availableCopies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Copies</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormItem>
                <FormLabel>Book Cover Image</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                </FormControl>
                {preview && (
                  <img
                    src={preview}
                    alt="Book Preview"
                    className="mt-2 h-24 w-24 object-cover rounded-md border"
                  />
                )}
              </FormItem>

              {/* Submit Button */}
              <div className="w-full flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default UpdateBook;
