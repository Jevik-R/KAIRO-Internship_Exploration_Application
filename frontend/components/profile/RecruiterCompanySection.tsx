import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecruiterCompanySectionProps {
  recruiter: any
  profileUser: any
  isOwner: boolean
}

export default function RecruiterCompanySection({ recruiter, profileUser, isOwner }: RecruiterCompanySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Company Information</CardTitle>
        <CardDescription>Details about the recruiting organization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recruiter?.company ? (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Company Name</p>
              <p className="text-base font-semibold text-foreground">{recruiter.company.name}</p>
            </div>
            {recruiter.company.industry && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Industry</p>
                <Badge variant="secondary">{recruiter.company.industry}</Badge>
              </div>
            )}
            {recruiter.company.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">About Company</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{recruiter.company.description}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No company information available</p>
            {isOwner && (
              <p className="text-xs text-muted-foreground mt-2">Add your company details to attract candidates</p>
            )}
          </div>
        )}

        {recruiter?.position && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-1">Position</p>
            <p className="text-base text-foreground">{recruiter.position}</p>
          </div>
        )}

        {recruiter?.website && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-1">Company Website</p>
            <a
              href={recruiter.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              {recruiter.website}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
