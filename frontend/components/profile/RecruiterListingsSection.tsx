"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Internship {
  id: string
  title: string
  description: string
  location: string
  type: string
  status: string
  applicantsCount: number
}

interface RecruiterListingsSectionProps {
  recruiterId: string
  isOwner: boolean
}

export default function RecruiterListingsSection({ recruiterId, isOwner }: RecruiterListingsSectionProps) {
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch(`/api/recruiter/internships?recruiterId=${recruiterId}`)
        if (response.ok) {
          const data = await response.json()
          setInternships(data.internships)
        }
      } catch (error) {
        console.error("[v0] Error fetching internships:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInternships()
  }, [recruiterId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Active Internship Listings</CardTitle>
          <CardDescription>Current opportunities from this recruiter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Active Internship Listings</CardTitle>
        <CardDescription>Current opportunities from this recruiter</CardDescription>
      </CardHeader>
      <CardContent>
        {internships.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No active listings at the moment</p>
            {isOwner && (
              <p className="text-xs text-muted-foreground mt-2">
                Create your first internship listing to attract candidates
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {internships.map((internship) => (
              <div
                key={internship.id}
                className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{internship.title}</h3>
                  <Badge variant={internship.status === "ACTIVE" ? "default" : "secondary"}>{internship.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{internship.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {internship.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {internship.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {internship.applicantsCount} applicants
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
