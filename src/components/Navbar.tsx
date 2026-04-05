import {
  Show,
  SignInButton,
  SignOutButton,
  useClerk,
  UserButton,
} from "@clerk/react"
import { navbarStyles } from "../assets/dummyStyles.ts"
import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Key, Menu, User, X } from "lucide-react"

const STORAGE_KEY = "doctorToken_v1"
import logo from "../assets/images/logo.png"
import { NAVBAR_ITEMS } from "@/data/Navbar.ts"
import { Button } from "./ui/button.tsx"
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY))
    } catch {
      return false
    }
  })

  console.log(isDoctorLoggedIn)
  const location = useLocation()
  const clerk = useClerk()
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false)
      } else {
        setShowNavbar(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setIsDoctorLoggedIn(Boolean(e.newValue))
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        isOpen &&
        navRef.current &&
        event.target instanceof Node &&
        !navRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])
  return (
    <>
      <header className={navbarStyles.navbarBorder}></header>
      <nav
        ref={navRef}
        className={`${navbarStyles.navbarContainer} ${showNavbar ? navbarStyles.navbarVisible : navbarStyles.navbarHidden}`}
      >
        <div className={navbarStyles.contentWrapper}>
          <div className={navbarStyles.flexContainer}>
            {/* Logo Here */}

            <Link to="/" className={`${navbarStyles.logoLink}`}>
              <div className={`${navbarStyles.logoContainer}`}>
                <div className={`${navbarStyles.logoImageWrapper}`}>
                  <img
                    src={logo}
                    alt="Logo"
                    className={navbarStyles.logoImage}
                  />
                </div>
              </div>
              <div className={navbarStyles.logoTextContainer}>
                <h1 className={navbarStyles.logoTitle}>MediCare</h1>
                <p className={navbarStyles.logoSubtitle}>
                  Your Health, Our Priority
                </p>
              </div>
            </Link>

            <div className={navbarStyles.desktopNav}>
              <div className={navbarStyles.navItemsContainer}>
                {NAVBAR_ITEMS.map((item: { href: string; label: string }) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`${navbarStyles.navItem} ${isActive ? navbarStyles.navItemActive : navbarStyles.navItemActive}`}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className={navbarStyles.rightContainer}>
              <Show when="signed-out">
                <SignOutButton>
                  <Link
                    to="/doctor-admin/login"
                    className={`${navbarStyles.doctorAdminButton}`}
                  >
                    <User className={`${navbarStyles.doctorAdminIcon}`} />
                    <span className={navbarStyles.doctorAdminText}>
                      Doctor Admin
                    </span>
                  </Link>
                </SignOutButton>
                <SignOutButton>
                  <Button
                    onClick={() => {
                      clerk.openSignIn()
                    }}
                    className={`${navbarStyles.loginButton} cursor-pointer`}
                  >
                    <Key className={`${navbarStyles.doctorAdminIcon}`} />
                    <span className={navbarStyles.doctorAdminText}>Login </span>
                  </Button>
                </SignOutButton>
              </Show>

              <Show when="signed-in">
                <SignInButton>
                  <UserButton />
                </SignInButton>
              </Show>

              <Button
                className={`${navbarStyles.mobileToggle} cursor-pointer`}
                size={"icon-sm"}
                variant={"outline"}
                onClick={() => {
                  setIsOpen(!isOpen)
                }}
              >
                {isOpen ? (
                  <X className={navbarStyles.toggleIcon} />
                ) : (
                  <Menu className={navbarStyles.toggleIcon} />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className={`${navbarStyles.mobileMenu}`}>
              {NAVBAR_ITEMS.map(
                (item: { href: string; label: string }, idx: number) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={idx}
                      to={item.href}
                      className={`${navbarStyles.mobileMenuItem} ${isActive ? navbarStyles.mobileMenuItemActive : navbarStyles.mobileMenuItemInactive}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                }
              )}
              <Show when="signed-out">
                <SignOutButton>
                  <Link
                    to="/doctor-admin/login"
                    onClick={() => {
                      setIsOpen(false)
                    }}
                    className={`${navbarStyles.mobileDoctorAdminButton}`}
                  >
                    <User className={`${navbarStyles.doctorAdminIcon}`} />
                    <span className={navbarStyles.doctorAdminText}>
                      Doctor Admin
                    </span>
                  </Link>
                </SignOutButton>

                <SignOutButton>
                  <Button
                    onClick={() => {
                      setIsOpen(false)
                      clerk.openSignIn()
                    }}
                    className={`${navbarStyles.mobileLoginButton} cursor-pointer`}
                  >
                    <Key className={`${navbarStyles.doctorAdminIcon}`} />
                    <span className={navbarStyles.doctorAdminText}>Login</span>
                  </Button>
                </SignOutButton>
              </Show>
            </div>
          )}
        </div>
        <style>{navbarStyles.animationStyles}</style>
      </nav>
    </>
  )
}

export default Navbar
