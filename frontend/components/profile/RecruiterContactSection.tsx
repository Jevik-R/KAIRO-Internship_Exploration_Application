import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RecruiterContactSectionProps {
  recruiter: any
  profileUser: any
  isOwner: boolean
}

export default function RecruiterContactSection({ recruiter, profileUser, isOwner }: RecruiterContactSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Contact Information</CardTitle>
        <CardDescription>Get in touch with the recruiter</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
          <a
            href={`mailto:${recruiter?.contactEmail || profileUser.email}`}
            className="text-sm text-primary hover:underline"
          >
            {recruiter?.contactEmail || profileUser.email}
          </a>
        </div>

        {recruiter?.about && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-2">About Recruiter</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{recruiter.about}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
