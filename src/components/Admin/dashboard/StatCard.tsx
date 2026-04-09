import { dashboardStyles as s } from "../../../assets/Admin/dummyStyles.js"

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
}
export const StatCard = ({ label, value, icon }: StatCardProps) => {
  return (
    <div
      className={
        s.statCard +
        " " +
        "relative overflow-hidden transition-shadow duration-300 hover:shadow-md"
      }
    >
      <div className="absolute -top-1 left-0 h-2 w-[101%] rounded-full bg-linear-to-r from-emerald-400 to-green-300" />
      <div className={s.statCardContent}>
        <div className={s.statIconContainer}>{icon}</div>
        <div className="flex-1">
          <p className={s.statLabel}>{label}</p>
          <p className={s.statValue}>{value}</p>
        </div>
      </div>
    </div>
  )
}
