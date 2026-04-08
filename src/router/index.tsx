import AdminLayout from "@/layouts/AdminLayout"
import RootLayout from "@/layouts/RootLayout"
import AboutPage from "@/pages/About"
import AdminHomePage from "@/pages/Admin"
import HomePage from "@/pages/Home"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHomePage />} />
        <Route path="home" element={<AdminHomePage />} />
      </Route>
    </>
  )
)

export default router
