"use client"

interface DashboardCardProps {
  icon: string
  label: string
  value: string | number
  description: string
  isDate?: boolean
}

export default function DashboardCard({ icon, label, value, description, isDate }: DashboardCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{icon}</span>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
          <p className={`${isDate ? "text-lg" : "text-3xl"} font-bold text-foreground`}>{value}</p>
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        </div>
      </div>
    </div>
  )
}
