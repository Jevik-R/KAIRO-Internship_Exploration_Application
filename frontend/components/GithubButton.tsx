"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function GithubButton({ userId, currentLink }: { userId: string; currentLink?: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [githubLink, setGithubLink] = useState(currentLink || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    if (!githubLink.trim()) return
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/auth/profile/GitHubAttach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, githubLink }),
      })

      if (!response.ok) throw new Error("Failed to update GitHub link")

      setIsEditing(false)
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating GitHub link")
    } finally {
      setLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <Button onClick={() => setIsEditing(true)} className="gap-2">
        <span>G</span>
        {currentLink ? "Edit GitHub" : "Add GitHub Profile"}
      </Button>
    )
  }

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
      <input
        type="url"
        value={githubLink}
        onChange={(e) => setGithubLink(e.target.value)}
        placeholder="https://github.com/username"
        className="w-full px-3 py-2 border rounded-md text-sm"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} disabled={loading}>
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setIsEditing(false)
            setGithubLink(currentLink || "")
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
