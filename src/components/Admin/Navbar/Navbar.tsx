import { Link, useLocation } from "react-router-dom"
import { navbarStyles as ns } from "../../../assets/Admin/dummyStyles.js"
import logoImage from "../../../assets/Admin/logo.png"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import {
  Calendar,
  Grid,
  Home,
  List,
  Menu,
  PlusSquare,
  UserPlus,
  Users,
  X,
} from "lucide-react"
import CenterNavItem from "./CenterNavItem.js"
import { Show, useAuth, useClerk, useUser } from "@clerk/react"
import MobileItem from "./MobileItem.js"
const AdminNavbar = () => {
  const [open, setOpen] = useState(false)
  const navInnerRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Clerk
  const clerk = useClerk()
  const { getToken, isLoaded: authLoaded } = useAuth()
  const { isSignedIn, user, isLoaded: userLoaded } = useUser()

  // Sliding active indicator logic
  const moveIndicator = useCallback(() => {
    const container = navInnerRef.current
    const ind = indicatorRef.current
    if (!container || !ind) return

    const active = container.querySelector(".nav-item.active")
    if (!active) {
      ind.style.opacity = "0"
      return
    }

    const containerRect = container.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()

    const left = activeRect.left - containerRect.left + container.scrollLeft
    const width = activeRect.width

    ind.style.transform = `translateX(${left}px)`
    ind.style.width = `${width}px`
    ind.style.opacity = "1"
  }, [])

  // It will moving in .12s after route change to allow DOM to update active class
  useLayoutEffect(() => {
    moveIndicator()
    const t = setTimeout(() => {
      moveIndicator()
    }, 120)
    return () => clearTimeout(t)
  }, [location.pathname, moveIndicator])

  // Scroll and resize listeners for indicator
  useEffect(() => {
    const container = navInnerRef.current
    if (!container) return

    const onScroll = () => {
      moveIndicator()
    }
    container.addEventListener("scroll", onScroll, { passive: true })

    const ro = new ResizeObserver(() => {
      moveIndicator()
    })
    ro.observe(container)
    if (container.parentElement) ro.observe(container.parentElement)

    window.addEventListener("resize", moveIndicator)

    moveIndicator()

    return () => {
      container.removeEventListener("scroll", onScroll)
      ro.disconnect()
      window.removeEventListener("resize", moveIndicator)
    }
  }, [moveIndicator])

  // Toggle mobile nav
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  // When the user is login fetching token to verify session and get user data
  useEffect(() => {
    let isMounted = true
    const storeToken = async () => {
      if (!authLoaded || !userLoaded) return
      if (!isSignedIn) {
        try {
          localStorage.removeItem("clerk_token")
          return
        } catch (error) {
          console.log(error)
        }

        return
      }

      try {
        if (getToken) {
          const token = await getToken()
          if (!isMounted) return
          if (token) {
            localStorage.setItem("clerk_token", JSON.stringify(token))
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    storeToken()
    return () => {
      isMounted = false
    }
  }, [isSignedIn, authLoaded, userLoaded, getToken, user])

  // To open clerk sign in widget
  const handleOpenSignIn = async () => {
    if (!clerk || !clerk.openSignIn) return

    clerk.openSignIn({
      fallbackRedirectUrl: "/admin/home",
    })
  }

  // To sign out user
  const handleSignOut = async () => {
    if (!clerk || !clerk.signOut) return
    try {
      await clerk.signOut({
        redirectUrl: "/admin",
      })
      localStorage.removeItem("clerk_token")
    } catch (error) {
      console.log(error)
    } finally {
      window.localStorage.removeItem("clerk_token")
    }
  }
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
                      to="/admin/home"
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
          {/* Right-aligned navigation links */}

          <div className={ns.rightContainer}>
            {/* Auth */}

            {isSignedIn ? (
              <button
                onClick={handleSignOut}
                className={ns.signOutButton + " " + ns.cursorPointer}
              >
                Sign Out
              </button>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <button
                  onClick={handleOpenSignIn}
                  className={ns.loginButton + " " + ns.cursorPointer}
                >
                  Login
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen((v) => !v)}
              className={ns.mobileMenuButton}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            className={ns.mobileOverlay}
            onClick={() => {
              setOpen((v) => !v)
            }}
          />
        )}
        {open && (
          <>
            <div className={ns.mobileMenuContainer} id="mobile-menu">
              <div className={ns.mobileMenuInner}>
                <MobileItem
                  to="/admin/home"
                  label="Dashboard"
                  icon={<Home size={16} />}
                  onClick={() => setOpen(false)}
                />

                <MobileItem
                  to="/admin/add"
                  label="Add Doctor"
                  icon={<UserPlus size={16} />}
                  onClick={() => setOpen(false)}
                />
                <MobileItem
                  to="/admin/list"
                  label="List Doctors"
                  icon={<Users size={16} />}
                  onClick={() => setOpen(false)}
                />
                <MobileItem
                  to="/admin/appointments"
                  label="Appointments"
                  icon={<Calendar size={16} />}
                  onClick={() => setOpen(false)}
                />

                <MobileItem
                  to="/admin/service-dashboard"
                  label="Service Dashboard"
                  icon={<Grid size={16} />}
                  onClick={() => setOpen(false)}
                />
                <MobileItem
                  to="/admin/add-service"
                  label="Add Service"
                  icon={<PlusSquare size={16} />}
                  onClick={() => setOpen(false)}
                />
                <MobileItem
                  to="/admin/list-service"
                  label="List Services"
                  icon={<List size={16} />}
                  onClick={() => setOpen(false)}
                />
                <MobileItem
                  to="/admin/service-appointments"
                  label="Service Appointments"
                  icon={<Calendar size={16} />}
                  onClick={() => setOpen(false)}
                />

                <Show when="signed-out">
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={handleOpenSignIn}
                      className={ns.loginButton + " " + ns.cursorPointer}
                    >
                      Login
                    </button>
                  </div>
                </Show>

                <Show when="signed-in">
                  <button
                    onClick={() => {
                      handleSignOut()
                      setOpen(false)
                    }}
                    className={
                      "w-full cursor-pointer items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm whitespace-nowrap text-white shadow-sm lg:mx-1 lg:-mr-6 lg:flex lg:text-xs xl:mx-1 xl:mr-5"
                    }
                  >
                    Sign Out
                  </button>
                </Show>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}

export default AdminNavbar
