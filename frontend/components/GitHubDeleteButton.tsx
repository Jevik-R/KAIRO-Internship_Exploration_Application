"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface GitHubDeleteButtonProps {
  userId: string
  onDelete: () => void
}

export default function GitHubDeleteButton({ userId, onDelete }: GitHubDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove your GitHub integration?")) return

    setIsDeleting(true)
    try {
      const response = await fetch("/api/auth/profile/delete-github-link", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          field: "githubLink",
          value: null,
        }),
      })

      if (response.ok) {
        onDelete()
      } else {
        alert("Failed to remove GitHub link")
      }
    } catch (error) {
      console.error("Error deleting GitHub link:", error)
      alert("An error occurred while removing GitHub link")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button onClick={handleDelete} disabled={isDeleting} variant="destructive" className="w-full">
      <Trash2 className="w-4 h-4 mr-2" />
      {isDeleting ? "Removing..." : "Remove GitHub Integration"}
    </Button>
  )
}
