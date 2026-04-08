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
    <div>
      <h1>Admin Layout</h1>
      <Outlet />
    </div>
  )
}

export default AdminLayout
