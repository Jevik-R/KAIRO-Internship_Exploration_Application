"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ActivityChartProps {
  userId: string
}

export default function ActivityChart({ userId }: ActivityChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await fetch(`/api/auth/dashboard/activity-chart?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setChartData(data.chartData)
        }
      } catch (error) {
        console.error("[v0] Error fetching activity chart:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivityData()
  }, [userId])

  if (loading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Application Activity</CardTitle>
          <CardDescription>Your application trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Application Activity</CardTitle>
        <CardDescription className="text-base">Your application trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            applications: {
              label: "Applications",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
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
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
