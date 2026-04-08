import AdminNavbar from "@/components/Admin/Navbar/Navbar"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

const AdminLayout = () => {
  useEffect(() => {
    document.title = "Admin Panel"
    document.head
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", "Admin panel for managing the application")
  }, [])
  return (
    <main className="min-h-screen bg-linear-to-b from-emerald-50 to-white font-sans">
      <AdminNavbar />
      <Outlet />
    </main>
  )
}

export default AdminLayout
