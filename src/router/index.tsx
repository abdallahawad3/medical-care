import RootLayout from "@/layouts/RootLayout"
import AboutPage from "@/pages/About"
import HomePage from "@/pages/Home"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
    </Route>
  )
)

export default router
