import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import Login from './components/auth/login'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import Layout from './components/Layout'
import Signup from './components/auth/Signup'
import Users from './components/Users'
import AdminBooks from './components/AdminBooks'
import Profile from './components/Profile'
import BooksHistoryPage from './components/BooksHistoryPage'
import { toast, Toaster } from 'sonner'
import Catalog from './components/Catalog'
import AdminDashBoard from './components/AdminDashBoard'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './features/user/userSlice'
import api from './utils/refreshTokenInterceptor'
import SideBarContext from './utils/contextApi'
import AboutUs from './components/AboutUs'

const router = createBrowserRouter([
  { path: '/', element: <Layout />,
    children: [
      { index:true, element: <Home /> },
      {path:'/admin/books', element:<AdminBooks/>},
      {path: '/admin/users', element:<Users/>},
      {path:'/books', element:<Catalog/>},
      {path: '/user/profile', element:<Profile/>},
      {path:'/borrowed/books', element:<BooksHistoryPage/>},
      {path: '/admin/dashboard', element: <AdminDashBoard/>},
      {path:'about-us',element:<AboutUs/>}
      // Add more routes here
    ]
   
   },
  { path: '/login', element: <Login /> },
  {path: '/signup', element: <Signup /> },
])



function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {user} = useSelector(state => state?.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/me');
        dispatch(setUser(res.data.user));
      } catch (err) {
        toast.error('Failed to fetch user profile');
        // Optionally redirect to login or show alert
      }
    };
    fetchProfile();
  }, []);

  return (
    <SideBarContext.Provider value={{collapsed, setCollapsed}}>
    <Toaster position="top-right" />
    <RouterProvider router={router}/>
    </SideBarContext.Provider>
  )
}

export default App
