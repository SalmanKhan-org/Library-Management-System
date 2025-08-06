import React from 'react'
import { Sidebar, SidebarProvider } from './ui/sidebar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import AppSidebar from './AppSidebar'
import Header from './Header'

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="flex w-screen h-screen overflow-hidden">
        <AppSidebar />

        <div className="flex flex-col flex-1">
          <Header />

          {/* Scrollable main content */}
          <main className="flex-1 overflow-y-auto scroll-smooth  bg-blue-100">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Layout
