"use client"

interface DashboardHeaderProps {
  user: any
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const greeting = getGreeting()

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">
        {greeting}, {user.name || "there"}!
      </h1>
      <p className="text-muted-foreground">Here's your application journey at a glance</p>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}
