import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { LuPanelRightOpen, LuPanelRightClose } from 'react-icons/lu'; // Destructure icons
import SideBarContext from '@/utils/contextApi';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button'; // Assuming you have a Button component for consistency
import { Link } from 'react-router-dom';
import { RiLogoutBoxLine } from "react-icons/ri";
import { RiLoginBoxLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { toast } from 'sonner';
import axios from 'axios';
import { RxHamburgerMenu } from "react-icons/rx";

const Header = () => {
  const { user } = useSelector(state => state?.user || {});
  const { collapsed, setCollapsed } = useContext(SideBarContext);

  // Placeholder for logout functionality
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, { withCredentials: true });
      if (response.data.success) {
        navigate('/login');
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error.response.data.message||"Something went wrong");
    }

  }
  return (
    // Outer container for the fixed header
    <header className="h-12 pr-4 bg-gray-800 text-white flex items-center border-b shadow-sm sticky top-0 z-50">
      <div className='w-full flex items-center justify-between'>
        {/* Company Name and Logo/Sidebar Toggle */}
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-1'>
            {/* Sidebar toggle button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-md text-gray-100 hover:text-gray-200  transition-colors duration-300"
              aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
            >
              {collapsed ? (
                <RxHamburgerMenu className="w-5 h-5" />
              ) : (
                <RxHamburgerMenu className="w-5 h-5" />
              )}
            </button>
            {/* Company Name */}
            <span className="text-lg font-bold text-gray-100 tracking-tight">Scholarly</span>
          </div>
          <div className='flex gap-4 items-center'>
            <Link to={'/'} className='text-xs' >Home</Link>
            {user?.role === 'admin' && (<Link to={'/admin/dashboard'} className='text-xs' >Dashboard</Link>)}
            {user?.role === 'admin' && (<Link to={'/admin/books'} className='text-xs' >My Books</Link>)}
            <Link to={'/books'} className='text-xs' >Catalog</Link>
            <Link to={'/about-us'} className='text-xs'>About us</Link>
          </div>
        </div>
        {/* User Profile and Actions */}
        <div className='flex items-center gap-4 mr-2'>
          {/* User Avatar */}
          <Link to={'/user/profile'}><FaRegUser className='w-4 h-4 text-white' /></Link>
          {/* Logout Button */}
          {user ? 
          <p onClick={handleLogout} className='cursor-pointer'>
            <RiLogoutBoxLine className="w-4 h-4 text-white" />
          </p>
          :<Link to={'/login'} ><RiLoginBoxLine className="w-4 h-4 text-white" /> </Link>}
        </div>
      </div>
    </header>
  );
};

export default Header;