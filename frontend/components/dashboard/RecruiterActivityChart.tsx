"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ActivityData {
  month: string
  applications: number
  hires: number
}

interface RecruiterActivityChartProps {
  userId: string
}

export default function RecruiterActivityChart({ userId }: RecruiterActivityChartProps) {
  const [data, setData] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard/recruiter-activity-chart")
        if (response.ok) {
          const chartData = await response.json()
          setData(chartData)
        }
      } catch (error) {
        console.error("[v0] Error fetching recruiter activity chart:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Recruitment Activity</CardTitle>
          <CardDescription>Applications received and hires made over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recruitment Activity</CardTitle>
        <CardDescription>Applications received and hires made over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            applications: {
              label: "Applications",
              color: "hsl(var(--chart-1))",
            },
            hires: {
              label: "Hires",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="applications"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorApplications)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="hires"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorHires)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
