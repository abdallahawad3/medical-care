import Navbar from "@/components/Navbar"
import { Outlet } from "react-router-dom"

const RootLayout = () => {
  return (
    <main>
      <Navbar />
      <Outlet />
    </main>
  )
}

export default RootLayout
