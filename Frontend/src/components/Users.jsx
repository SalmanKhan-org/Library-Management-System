import React, { useEffect, useState, useRef } from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { MdDelete } from 'react-icons/md';
import api from '@/utils/refreshTokenInterceptor';
import { toast } from 'sonner';
import { Search } from 'lucide-react';

const AllUsers = [
  {
    "firstName": "Aarav",
    "lastName": "Sharma",
    "email": "aarav.sharma@example.com",
    "role": "admin"
  },
  {
    "firstName": "Meera",
    "lastName": "Patel",
    "email": "meera.patel@example.com",
    "role": "user"
  },
  {
    "firstName": "Rahul",
    "lastName": "Verma",
    "email": "rahul.verma@example.com",
    "role": "user"
  },
  {
    "firstName": "Sneha",
    "lastName": "Reddy",
    "email": "sneha.reddy@example.com",
    "role": "user"
  },
  {
    "firstName": "Kunal",
    "lastName": "Joshi",
    "email": "kunal.joshi@example.com",
    "role": "admin"
  },
  {
    "firstName": "Tanya",
    "lastName": "Mehta",
    "email": "tanya.mehta@example.com",
    "role": "user"
  },
  {
    "firstName": "Vikram",
    "lastName": "Singh",
    "email": "vikram.singh@example.com",
    "role": "user"
  }
]


const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // index of open dropdown
  const dropdownRefs = useRef([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/admin/get/all');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown !== null &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown].contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  // Search User based on first name, last name,email or role
  useEffect(() => {
    const filteredUsers = AllUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchQuery) ||
        user.lastName.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery) ||
        user.role.toLowerCase().includes(searchQuery)
    );
    setUsers(filteredUsers);
  }, [searchQuery]);

  return (
    <div className="w-full p-2 min-h-screen">
      <div className='flex justify-between items-center mb-2'>
        <h1 className='text-base font-semibold'>A List of Your Library Members</h1>
        <div className="relative md:w-[15%]">
          <input
            type="text"
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            placeholder="Search users here..."
            className="w-full border bg-white p-2 rounded leading-none text-[12px] pr-8"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-gray-500" />
        </div>
      </div>
      <div className="border border-gray-200 shadow-md rounded overflow-hidden">
        <table className="table-auto w-full text-sm">
          <thead className="bg-white text-gray-600 text-xs">
            <tr >
              <th className="p-0.5 text-center rounded-tl-md">Sr. No</th>
              <th className="p-0.5 text-center">First Name</th>
              <th className="p-0.5 text-center">Last Name</th>
              <th className="p-0.5 text-center">Email</th>
              <th className="p-0.5 text-center">Delete</th>
              <th className="p-0.5 text-center">Role</th>
              <th className="p-0.5 text-center rounded-tr-md">Edit</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 && users.map((user, index) => (
              <tr
                key={index}
                className={index % 2 !== 0 ? 'bg-white ' : 'bg-blue-50 hover:bg-blue-100'}
              >
                <td className="p-0.5 text-xs text-center text-gray-700">{index + 1}</td>
                <td className="p-0.5 text-xs text-center">{user.firstName}</td>
                <td className="p-0.5 text-xs text-center">{user.lastName}</td>
                <td className="p-0.5 text-xs text-center">{user.email}</td>
                <td className="p-0.5 text-center">
                  <button
                    // onClick={() => {
                    //       deleteBook(book._id);
                    //     }}
                    className="inline-flex items-center justify-center leading-none p-1 text-[10px] rounded bg-red-600 hover:bg-red-700 text-white/90 transition-colors duration-300"
                  >Delete</button>
                </td>
                <td className="p-0.5 text-xs text-center">{user.role}</td>
                <td
                  className="text-center p-0.5 relative"
                  ref={(el) => (dropdownRefs.current[index] = el)}
                >
                  <button
                    onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                    className="text-gray-600 hover:text-gray-900 transition duration-150"
                  >
                    <HiOutlineDotsVertical className="w-3 h-3" />
                  </button>

                  {openDropdown === index && (
                    <div
                      className={`absolute z-50 w-36 bg-slate-900 text-gray-300 border  rounded-md shadow-md transition-all duration-200 ease-out ${users.length - index <= 2
                        ? "bottom-full -mb-1 right-2"
                        : "top-full -mt-1 right-2"
                        }`}
                    >
                      <div
                        onClick={() => {
                          toast.success("Role changed to Admin");
                          setOpenDropdown(null);
                        }}
                        className="px-2 py-1 text-sm rounded  hover:text-white hover:bg-emerald-400 cursor-pointer flex items-center gap-2"
                      >
                        <span className="inline-block w-2 h-2 text-white bg-green-600 rounded-full"></span>
                        <span>Make Admin</span>
                      </div>
                      <div
                        onClick={() => {
                          toast.success("Role changed to User");
                          setOpenDropdown(null);
                        }}
                        className="px-2 py-1 text-sm rounded  hover:bg-emerald-600 hover:text-white cursor-pointer flex items-center gap-2"
                      >
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Make User</span>
                      </div>
                    </div>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
