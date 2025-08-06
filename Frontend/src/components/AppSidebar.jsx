import React, { useContext, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '../lib/utils';
import { Home, BookOpen, Users } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser } from "react-icons/fa6";
import { FaBook } from "react-icons/fa";
import { IoMdTimer } from "react-icons/io";
import { RiLogoutBoxLine } from "react-icons/ri";
import { RiLoginBoxLine } from "react-icons/ri";
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import SideBarContext from '@/utils/contextApi';
import { RxDashboard } from "react-icons/rx";
import { BiSolidMessageAltDetail } from "react-icons/bi";

const AppSidebar = () => {
    const { user } = useSelector(state => state?.user);
    const navigate = useNavigate();
    const { collapsed } = useContext(SideBarContext);
    const [isActive, setIsActive] = useState(false);
    const location = useLocation();

    const handleLogout = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/logout`, { withCredentials: true });
            if (response.data.success) {
                navigate('/login');
                toast.success(response?.data?.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }

    }


    return (
        <div
            className={
                `flex flex-col  bg-gray-900 text-gray-300 transition-all duration-300 ease-in-out
                h-screen ${collapsed ? 'w-[62px] items-center' : 'w-[230px]'}
            `}
        >
            {/* Header */}
            <div className='flex flex-col items-center'>
                <div className="flex  items-center justify-end p-2">
                    {/* // <Button
                    //     variant="ghost"
                    //     size="icon"
                    //     className="text-white border-none hover:bg-gray-800"
                    //     onClick={() => setCollapsed(!collapsed)}
                    // >
                    //     <Menu className="w-5 h-5 text-white" />
                    // </Button> */}
                </div>
                {!collapsed && (
                    <div className='w-full flex justify-center'>
                        <div className="flex flex-col items-center">
                            <Avatar className="w-28 h-28">
                                <AvatarImage src={user?.image || "https://github.com/shadcn.png"} alt="User" />
                                <AvatarFallback>JD</AvatarFallback>

                            </Avatar>
                            <div className="flex flex-col items-center">
                                {!collapsed && <span className="text-sm text-left">{user?.firstName + " " + user?.lastName || "John Doe"}</span>}
                                {!collapsed && <span className="text-xs text-white/50">{user?.email || "johndoe@gmail.com"}</span>}
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* Menu Items */}
            <div className="flex flex-1 flex-col space-y-2 p-2">
                <Link to={'/'}>
                    <SidebarItem icon={<Home className="w-3.5 h-3.5" />} label="Home" collapsed={collapsed} isActive={location.pathname === '/'} />
                </Link>
                {user && user.role === 'admin' && (
                    <>
                        <Link to={'/admin/dashboard'}>
                            <SidebarItem icon={<RxDashboard className="w-3.5 h-3.5" />} label="Dashboard" collapsed={collapsed} isActive={location.pathname === '/admin/dashboard'} />
                        </Link>
                        <Link to={'/admin/books'}>
                            <SidebarItem icon={<BookOpen className="w-3.5 h-3.5" />} label="My Books" collapsed={collapsed} isActive={location.pathname === '/admin/books'} />
                        </Link>
                    </>
                )}


                <Link to={'/books'}>
                    <SidebarItem icon={<FaBook className="w-3.5 h-3.5" />} label="Catalog" collapsed={collapsed} isActive={location.pathname === '/books'} />
                </Link>

                <Link to={'/borrowed/books'}>
                    <SidebarItem icon={<IoMdTimer className="w-3.5 h-3.5" />} label="Borrow History" collapsed={collapsed} isActive={location.pathname === '/borrowed/books'} />
                </Link>

                {user && user?.role === 'admin' && (
                    <Link to={'/admin/users'}>
                        <SidebarItem icon={<Users className="w-3.5 h-3.5" />} label="Users" collapsed={collapsed} isActive={location.pathname === '/admin/users'} />
                    </Link>
                )}
                <Link to={'/user/profile'}>
                    <SidebarItem icon={<FaUser className="w-3.5 h-3.5" />} label="My Profile" collapsed={collapsed} isActive={location.pathname === '/user/profile'} />
                </Link>
                <Link to={'/about-us'}>
                    <SidebarItem icon={<BiSolidMessageAltDetail className="w-3.5 h-3.5" />} label="About us" collapsed={collapsed} isActive={location.pathname === '/about-us'} />
                </Link>
            </div>

            {/* Footer with user info */}
            <div className={`border-t  border-gray-700 ${collapsed ? 'w-full flex items-center justify-center' : ''}`}>
                {user ? (
                    <span onClick={handleLogout}>
                        <SidebarItem icon={<RiLogoutBoxLine className="w-3.5 h-3.5" />} label="Logout" collapsed={collapsed} />
                    </span>
                ) : (
                    <Link to={'/login'}>
                        <SidebarItem icon={<RiLoginBoxLine className="w-3.5 h-3.5" />} label="Log In" collapsed={collapsed} />
                    </Link>
                )}
            </div>
        </div>
    );
};
// Keep this as-is
const SidebarItem = ({ icon, label, collapsed, isActive }) => (
    <div
        className={`flex items-center space-x-3 text-sm cursor-pointer p-2 rounded
      ${isActive ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-600 hover:text-white'}
    `}
    >
        {icon}
        {!collapsed && <span>{label}</span>}
    </div>
);


export default AppSidebar;
