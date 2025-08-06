import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form';
import { IoMdClose } from 'react-icons/io';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Form Schema
const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name cannot exceed 50 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name cannot exceed 50 characters'),
  phoneNo: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .regex(/^\+?[0-9\s-]+$/, 'Invalid phone number format'), // Allows optional +, digits, spaces, hyphens
  image: z.any()
    .refine((file) => !file || file instanceof File, "Image must be a file.") // Optional: can be null/undefined or a File
    .refine((file) => !file || file.size <= 2 * 1024 * 1024, `Max image size is 2MB.`) // Example: 2MB limit
    .refine((file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), "Only .jpg, .jpeg, .png, and .webp formats are supported."),
});

// Default user for fallback, though `user` prop should ideally be provided
const defaultUser = {
  firstName: 'John',
  lastName: 'Doe',
  phoneNo: '1234567890',
  profileImageUrl: "" // Renamed for clarity if user object comes with an image URL
};

const UpdateUserProfile = ({ user, onClose }) => {
  const [preview, setPreview] = useState(user?.profileImageUrl || null); // Initialize preview with existing image
  const [file, setFile] = useState(null); // This will hold the *new* file if selected

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || defaultUser.firstName,
      lastName: user?.lastName || defaultUser.lastName,
      phoneNo: user?.phoneNo || defaultUser.phoneNo,
      image: undefined // No file selected by default for upload
    }
  });

  // Effect to update form defaults and preview when 'user' prop changes
  // This is important if the component is reused or `user` prop changes
  useEffect(() => {
    form.reset({
      firstName: user?.firstName || defaultUser.firstName,
      lastName: user?.lastName || defaultUser.lastName,
      phoneNo: user?.phoneNo || defaultUser.phoneNo,
      image: undefined
    });
    setPreview(user?.profileImageUrl || null);
    setFile(null); // Reset file on user change
  }, [user, form]);


  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('phoneNo', data.phoneNo);

    // Only append the image file if a new one has been selected
    if (file) {
      formData.append('image', file); // Use 'profileImage' as the key for your backend
    }
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/me/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });

      if (response.data.success) {
        onClose(); // Close modal on success
        toast.success(response.data.message || "Profile updated successfully!");
        // Optionally, if you have a way to refresh user data in the parent component:
        // fetchUserData();
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Store the actual file
      setPreview(URL.createObjectURL(selectedFile)); // Create URL for local preview
    } else {
      setFile(null);
      setPreview(user?.profileImageUrl || null); // Revert to existing image or null if input is cleared
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-70 backdrop-blur-sm p-4 overflow-y-auto">
      <Card className="relative w-full max-w-md bg-white text-gray-900 border border-gray-200 shadow-xl rounded-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Update Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200"
            aria-label="Close"
          >
            <IoMdClose className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your first name"
                        {...field}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your last name"
                        {...field}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
                    <FormControl>
                      {/* Changed type to "tel" for better mobile keyboard, but Zod schema validates as string/regex */}
                      <Input
                        type="tel"
                        placeholder="e.g., +91 9876543210"
                        {...field}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              {/* Profile Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange, ref } }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Profile Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleImageChange(e); // for local preview
                          onChange(e.target.files[0]); // set value in react-hook-form state
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
                    {(preview || user?.profileImageUrl) && (
                      <div className="mt-4 flex items-center space-x-4">
                        <img
                          src={preview || user?.profileImageUrl}
                          alt="Profile Preview"
                          className="h-24 w-24 rounded-full object-cover border border-gray-200 shadow-sm"
                        />
                        {preview && preview !== user?.profileImageUrl && ( // Show "Clear" if a *new* preview exists
                          <Button
                            type="button"
                            variant="outline" // Assuming your Button component has an outline variant
                            onClick={() => {
                              setPreview(user?.profileImageUrl || null); // Reset preview
                              setFile(null);                            // Reset file state
                              form.setValue('image', undefined);        // Clear react-hook-form state

                              if (ref?.current) {
                                try {
                                  ref.current.value = '';               // ✅ Legal reset
                                } catch (err) {
                                  console.warn("Couldn't reset file input", err);
                                }
                              }
                            }}

                            className="text-sm text-gray-700 border-gray-300 hover:bg-gray-100"
                          >
                            Clear Image
                          </Button>
                        )}
                      </div>
                    )}
                    <FormMessage className="text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4 border-t border-gray-200 -mx-6 px-6">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-900 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-900 transition-colors duration-200"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default UpdateUserProfile;