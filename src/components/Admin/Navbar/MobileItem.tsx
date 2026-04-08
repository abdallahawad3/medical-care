import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"

import { navbarStyles as ns } from "../../../assets/Admin/dummyStyles.js"

interface MobileItemProps {
  to: string
  label: string
  icon: ReactNode
  onClick?: () => void
}
const MobileItem = ({ to, label, icon }: MobileItemProps) => {
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

export default MobileItem
