"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SuccessGaugeProps {
  userId: string
}

export default function SuccessGauge({ userId }: SuccessGaugeProps) {
  const [successRate, setSuccessRate] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSuccessRate = async () => {
      try {
        const response = await fetch("/api/auth/dashboard/stats")
        if (response.ok) {
          const data = await response.json()
          const rate =
            data.totalApplications > 0 ? Math.round((data.acceptedApplications / data.totalApplications) * 100) : 0
          setSuccessRate(rate)
        }
      } catch (error) {
        console.error("[v0] Error fetching success rate:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuccessRate()
  }, [userId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Success Rate</CardTitle>
          <CardDescription>Application acceptance rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  // Calculate gauge rotation (0-180 degrees)
  const rotation = (successRate / 100) * 180

  // Determine color based on success rate
  const getColor = () => {
    if (successRate >= 70) return "hsl(var(--chart-2))" // Green
    if (successRate >= 40) return "hsl(var(--chart-3))" // Yellow
    return "hsl(var(--chart-4))" // Red
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Success Rate</CardTitle>
        <CardDescription>Application acceptance rate</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative w-64 h-32 mb-4">
          {/* Gauge background arc */}
          <svg className="w-full h-full" viewBox="0 0 200 100">
            {/* Background arc */}
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Colored arc */}
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke={getColor()}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(successRate / 100) * 251.2} 251.2`}
              className="transition-all duration-1000 ease-out"
            />
            {/* Needle */}
            <g transform={`rotate(${rotation - 90} 100 90)`} className="transition-transform duration-1000 ease-out">
              <line
                x1="100"
                y1="90"
                x2="100"
                y2="30"
                stroke="hsl(var(--foreground))"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="100" cy="90" r="6" fill="hsl(var(--foreground))" />
            </g>
          </svg>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold" style={{ color: getColor() }}>
            {successRate}%
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {successRate >= 70 && "Excellent performance!"}
            {successRate >= 40 && successRate < 70 && "Good progress!"}
            {successRate < 40 && "Keep applying!"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
