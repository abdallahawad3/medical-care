import { Link } from "react-router-dom"
import { navbarStyles as ns } from "../../../assets/Admin/dummyStyles.js"
import logoImage from "../../../assets/Admin/logo.png"
import { useRef } from "react"
import {
  Calendar,
  Grid,
  Home,
  List,
  PlusSquare,
  UserPlus,
  Users,
} from "lucide-react"
import CenterNavItem from "./CenterNavItem.js"
const AdminNavbar = () => {
  // const [open, setOpen] = useState(false)
  const navInnerRef = useRef<HTMLDivElement>(null)
  // const location = useLocation()
  // const navigation = useNavigate()
  return (
    <header className={ns.header}>
      <nav className={ns.navContainer}>
        <div className={ns.flexContainer}>
          <div className={ns.logoContainer}>
            <img src={logoImage} alt="Logo Image" className={ns.logoImage} />
            <Link to="/admin">
              <div className={ns.logoLink}>MediCare</div>
              <div className={ns.logoSubtext}>Admin Panel</div>
            </Link>
          </div>

          {/* Center navigation links */}
          <div className={ns.centerNavContainer}>
            <div className={ns.glowEffect}>
              <div className={ns.centerNavInner}>
                <div
                  ref={navInnerRef}
                  tabIndex={0}
                  className={ns.centerNavScrollContainer}
                  style={{
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <div
                    ref={navInnerRef}
                    tabIndex={0}
                    className={ns.centerNavScrollContainer}
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    <CenterNavItem
                      to="/admin/h"
                      label="Dashboard"
                      icon={<Home size={16} />}
                    />
                    <CenterNavItem
                      to="/admin/add"
                      label="Add Doctor"
                      icon={<UserPlus size={16} />}
                    />
                    <CenterNavItem
                      to="/admin/list"
                      label="List Doctors"
                      icon={<Users size={16} />}
                    />
                    <CenterNavItem
                      to="/admin/appointments"
                      label="Appointments"
                      icon={<Calendar size={16} />}
                    />
                    <CenterNavItem
                      to="/admin/service-dashboard"
                      label="Service Dashboard"
                      icon={<Grid size={16} />}
                    />
                    <CenterNavItem
                      to="/admin/add-service"
                      label="Add Service"
                      icon={<PlusSquare size={16} />}
                    />
                    <CenterNavItem
                      to="/admin/list-service"
                      label="List Services"
                      icon={<List size={16} />}
                    />
                    <CenterNavItem
                      to="/admin/service-appointments"
                      label="Service Appointments"
                      icon={<Calendar size={16} />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default AdminNavbar
