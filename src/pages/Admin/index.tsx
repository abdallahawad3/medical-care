/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadgePoundSterling,
  CalendarRange,
  CheckCircle,
  Search,
  UserRoundCheck,
  XCircle,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { dashboardStyles as s } from "../../assets/Admin/dummyStyles.js"

import { StatCard } from "@/components/Admin/dashboard/StatCard.js"

const PATIENT_COUNT_API = `${import.meta.env.VITE_API_BASE_URL}/appointments/patient/count`
const safeNumber = (v: any, fallback = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}
// Normalizes doctor data from various API responses into a consistent format
function normalizeDoctor(doc: any) {
  const id = doc._id || doc.id || String(Math.random()).slice(2)
  const name =
    doc.name ||
    doc.fullName ||
    `${doc.firstName || ""} ${doc.lastName || ""}`.trim() ||
    "Unknown"
  const specialization =
    doc.specialization ||
    doc.specialty ||
    (Array.isArray(doc.specializations)
      ? doc.specializations.join(", ")
      : "") ||
    "General"
  const fee = safeNumber(
    doc.fee ?? doc.fees ?? doc.consultationFee ?? doc.consultation_fee ?? 0,
    0
  )
  const image =
    doc.imageUrl ||
    doc.image ||
    doc.avatar ||
    `https://i.pravatar.cc/150?u=${id}`

  const appointments = {
    total:
      doc.appointments?.total ??
      doc.totalAppointments ??
      doc.appointmentsTotal ??
      0,
    completed:
      doc.appointments?.completed ??
      doc.completedAppointments ??
      doc.appointmentsCompleted ??
      0,
    canceled:
      doc.appointments?.canceled ??
      doc.canceledAppointments ??
      doc.appointmentsCanceled ??
      0,
  }

  let earnings = null
  if (doc.earnings !== undefined && doc.earnings !== null)
    earnings = safeNumber(doc.earnings, 0)
  else if (doc.revenue !== undefined && doc.revenue !== null)
    earnings = safeNumber(doc.revenue, 0)
  else if (appointments.completed && fee)
    earnings = fee * safeNumber(appointments.completed, 0)
  else earnings = 0

  return {
    id,
    name,
    specialization,
    fee,
    image,
    appointments,
    earnings,
    raw: doc,
  }
}

const AdminHomePage = () => {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // new patient count state
  const [patientCount, setPatientCount] = useState<number>(0)
  console.log(patientCount, error)
  const [patientCountLoading, setPatientCountLoading] = useState(false)

  const [query, setQuery] = useState("")
  const [showAll, setShowAll] = useState(false)

  // Load our doctors from the API

  useEffect(() => {
    let mounted = true
    async function loadDoctors() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`http://localhost:5000/api/doctors?limit=200`)
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(
            body?.message || `Failed to fetch doctors (${res.status})`
          )
        }
        const body = await res.json()
        let list = []
        if (Array.isArray(body)) list = body
        else if (Array.isArray(body.data?.doctors)) list = body.data.doctors
        else if (Array.isArray(body.data)) list = body.data
        else if (Array.isArray(body.items)) list = body.items
        else {
          const firstArray = Object.values(body).find((v) => Array.isArray(v))
          if (firstArray) list = firstArray
        }
        const normalized = list.map((d: any) => normalizeDoctor(d))
        if (mounted) setDoctors(normalized)
      } catch (err) {
        console.error("Failed to load doctors:", err)
        if (mounted) {
          const errMsg = err instanceof Error ? err.message : String(err)
          setError(errMsg || "Failed to load doctors")
          setDoctors([])
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadDoctors()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    async function loadPatientCount() {
      setPatientCountLoading(true)
      try {
        const res = await fetch(PATIENT_COUNT_API)
        if (!res.ok) {
          console.warn("Patient count fetch failed:", res.status)
          if (mounted) setPatientCount(0)
          return
        }

        const body = await res.json().catch(() => ({}))
        const count = Number(body?.count ?? body?.totalUsers ?? body?.data ?? 0)
        if (mounted) setPatientCount(isNaN(count) ? 0 : count)
      } catch (err) {
        console.error("Failed to fetch patient count:", err)
        if (mounted) setPatientCount(0)
      } finally {
        if (mounted) setPatientCountLoading(false)
      }
    }
    loadPatientCount()
    return () => {
      mounted = false
    }
  }, [])

  const totals = useMemo(() => {
    const totalDoctors = doctors.length
    const totalAppointments = doctors.reduce(
      (s, d) => s + safeNumber(d.appointments?.total, 0),
      0
    )
    const totalEarnings = doctors.reduce(
      (s, d) => s + safeNumber(d.earnings, 0),
      0
    )
    const completed = doctors.reduce(
      (s, d) => s + safeNumber(d.appointments?.completed, 0),
      0
    )
    const canceled = doctors.reduce(
      (s, d) => s + safeNumber(d.appointments?.canceled, 0),
      0
    )
    const totalLoginPatients =
      doctors.reduce((s, d) => s + (d.raw?.loginPatientsCount ?? 0), 0) || 0
    return {
      totalDoctors,
      totalAppointments,
      totalEarnings,
      completed,
      canceled,
      totalLoginPatients,
    }
  }, [doctors])

  const filteredDoctors = useMemo(() => {
    if (!query) return doctors
    const q = query.trim().toLowerCase()
    const qNum = Number(q)
    return doctors.filter((d) => {
      if (d.name.toLowerCase().includes(q)) return true
      if ((d.specialization || "").toLowerCase().includes(q)) return true
      if (d.fee.toString().includes(q)) return true
      if (!Number.isNaN(qNum) && d.fee <= qNum) return true
      return false
    })
  }, [doctors, query])

  const INITIAL_COUNT = 8
  const visibleDoctors = showAll
    ? filteredDoctors
    : filteredDoctors.slice(0, INITIAL_COUNT)
  return (
    <div className={s.pageContainer}>
      <div className={s.maxWidthContainer}>
        <div className={s.headerContainer}>
          <div>
            <h1 className={s.headerTitle}>Admin Dashboard</h1>
            <p className={s.headerSubtitle}>
              Welcome back, Admin! Here's an overview of the hospital's
              performance.
            </p>
          </div>
        </div>
        {/* Stats Section */}
        <div className={s.statsGrid}>
          <StatCard
            icon={<UserRoundCheck size={24} color="#4A90E2" />}
            label="Total Registered Doctors"
            value={totals.totalDoctors}
          />
          <StatCard
            icon={<UserRoundCheck size={24} color="#4A90E2" />}
            label="Total Registered Patients"
            value={
              patientCountLoading ? "Loading..." : totals.totalLoginPatients
            }
          />
          <StatCard
            icon={<CalendarRange size={24} color="#4A90E2" />}
            label="Total Appointments"
            value={totals.totalAppointments}
          />
          <StatCard
            icon={<BadgePoundSterling size={24} color="#4A90E2" />}
            label="Total Earnings"
            value={totals.totalEarnings.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          />
          <StatCard
            icon={<CheckCircle size={24} color="#4A90E2" />}
            label="Completed Appointments"
            value={totals.completed}
          />
          <StatCard
            icon={<XCircle size={24} color="#4A90E2" />}
            label="Canceled Appointments"
            value={totals.canceled}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="search"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Search Doctors
          </label>
          <div className={`flex items-center gap-2`}>
            <div className="relative flex flex-1 items-center gap-3">
              <input
                id="search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, specialization, or fee..."
                className={`mb-1 w-full rounded-full border border-green-200 bg-white py-2 pr-4 pl-10 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-green-200 focus:outline-none`}
              />
              <Search className={`absolute right-2 text-green-500`} />
            </div>
            <button
              onClick={() => {
                setQuery("")
                setShowAll((s) => !s)
              }}
              className={s.clearButton + " " + "cursor-pointer"}
            >
              Clear
            </button>
          </div>
        </div>

        <div className={s.tableContainer}>
          <div className={s.tableHeader}>
            <h2 className={s.tableTitle}>Doctors</h2>
            <p className={s.tableCount}>
              {loading
                ? "Loading..."
                : `Showing ${filteredDoctors.length} doctor${filteredDoctors.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <div className={s.tableWrapper}>
            <table className={s.table}>
              {" "}
              <thead className={s.tableHead}>
                <tr>
                  <th className={s.tableHeaderCell}>Doctor</th>
                  <th className={s.tableHeaderCell}>Specialization</th>
                  <th className={s.tableHeaderCell}>Fee</th>
                  <th className={s.tableHeaderCell}>Appointments</th>
                  <th className={s.tableHeaderCell}>Completed</th>
                  <th className={s.tableHeaderCell}>Canceled</th>
                  <th className={s.tableHeaderCell}>Total Earnings</th>
                </tr>
              </thead>
              <tbody className={s.tableBody}>
                {visibleDoctors.map((d, idx) => (
                  <tr
                    key={d.id}
                    className={
                      s.tableRow +
                      " " +
                      (idx % 2 === 0 ? s.tableRowEven : s.tableRowOdd)
                    }
                  >
                    <td className={s.tableCell + " " + s.tableCellFlex}>
                      <div className={s.verticalLine} />
                      <img
                        src={d.image}
                        alt={d.name}
                        className={s.doctorImage}
                      />
                      <div>
                        <div className={s.doctorName}>{d.name}</div>
                        <div className={s.doctorId}>ID: {d.id}</div>
                      </div>
                    </td>

                    <td className={s.tableCell + " " + s.doctorSpecialization}>
                      {d.specialization}
                    </td>

                    <td className={s.tableCell + " " + s.feeText}>$ {d.fee}</td>

                    <td className={s.tableCell + " " + s.appointmentsText}>
                      {d.appointments.total}
                    </td>

                    <td className={s.tableCell + " " + s.completedText}>
                      {d.appointments.completed}
                    </td>

                    <td className={s.tableCell + " " + s.canceledText}>
                      {d.appointments.canceled}
                    </td>

                    <td className={s.tableCell + " " + s.earningsText}>
                      $ {d.earnings.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={s.mobileDoctorContainer}>
            <div className={s.mobileDoctorGrid}>
              {visibleDoctors.map((d) => (
                <MobileDoctorCard doctor={d} key={d.id} />
              ))}
            </div>
          </div>

          {filteredDoctors.length > INITIAL_COUNT && (
            <div className={s.showMoreContainer}>
              <button
                onClick={() => setShowAll((s) => !s)}
                className={s.showMoreButton + " " + "cursor-pointer"}
              >
                {showAll
                  ? "Show Less"
                  : `Show All (${filteredDoctors.length - INITIAL_COUNT} )`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MobileDoctorCard({ doctor, key }: { doctor: any; key: string }) {
  return (
    <div key={key} className={s.mobileDoctorCard}>
      <div className={s.mobileDoctorHeader}>
        <div className="flex items-center gap-3">
          <img
            src={doctor.image}
            alt={doctor.name}
            className={s.mobileDoctorImage}
          />

          <div>
            <p className={s.mobileDoctorName}>{doctor.name}</p>
            <p className={s.mobileDoctorSpecialization}>
              {doctor.specialization}
            </p>
          </div>
        </div>

        <div className={s.mobileDoctorFee}>$ {doctor.fee}</div>
      </div>

      <div className={s.mobileStatsGrid}>
        <div>
          <div className={s.mobileStatLabel}>Appts</div>
          <div className={s.mobileStatValue}> {doctor.appointments.total}</div>
        </div>
        <div>
          <div className={s.mobileStatLabel}>Done</div>
          <div className={s.mobileStatValue + " " + s.textEmerald600}>
            {" "}
            {doctor.appointments.completed}
          </div>
        </div>
        <div>
          <div className={s.mobileStatLabel}>Canceled</div>
          <div className={s.mobileStatValue + " " + s.textRose500}>
            {" "}
            {doctor.appointments.canceled}
          </div>
        </div>
      </div>

      <div className={s.mobileEarningsContainer}>
        <p>Earnings: $ {doctor.earnings.toLocaleString()}</p>
        <div
          className={"font-semibold"}
          style={{
            backgroundColor: doctor.earnings > 0 ? "#D1FAE5" : "#FEE2E2",
            color: doctor.earnings > 0 ? "#065F46" : "#991B1B",
          }}
        >
          {doctor.earnings > 0 ? "Profitable" : "No Earnings"}
        </div>
      </div>
    </div>
  )
}
export default AdminHomePage
