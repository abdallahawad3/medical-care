import type { ReactElement } from "react"
import { NavLink } from "react-router-dom"
import { navbarStyles as ns } from "../../../assets/Admin/dummyStyles.js"

interface IProps {
  to: string
  icon: ReactElement
  label: string
}

const CenterNavItem = ({ to, icon, label }: IProps) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `nav-item ${ns.centerNavItemBase} ${isActive ? ns.centerNavItemActive : ns.centerNavItemInactive}`
      }
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  )
}

export default CenterNavItem
