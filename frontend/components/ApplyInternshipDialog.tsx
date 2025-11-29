"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  Loader2,
  X,
  User,
  FileText,
  Clock,
  CheckCircle2,
  GraduationCap,
  Building2,
} from "lucide-react";
import { useState, useEffect } from "react";
import FileUpload from "@/components/FileUpload";

interface ApplyInternshipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  internship: any;
  userId: string;
  onSuccess?: () => void;
}

export function ApplyInternshipDialog({
  open,
  onOpenChange,
  internship,
  userId,
  onSuccess,
}: ApplyInternshipDialogProps) {
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [fetchingResume, setFetchingResume] = useState(false);
  const [isUsingProfileResume, setIsUsingProfileResume] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  if (!internship) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleUseProfileResume = async () => {
    // Ensure we have a User ID (passed from props or session hook)
    // Assuming 'Id' is the variable holding the logged-in user's ID
    if (!userId) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      setFetchingResume(true);

      const res = await fetch("/api/auth/profile/get-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch resume");
      }

      // Success! Update state
      setResumeUrl(data.resumeLink);
      setIsUsingProfileResume(true);
      toast.success("Resume attached from profile!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setFetchingResume(false);
    }
  };

  const clearResumeSelection = () => {
    setResumeUrl("");
    setIsUsingProfileResume(false);
  };

  // Apply to internship
  const applyToInternship = async (
    internshipId: string,
    resumeUrl: string,
    coverLetter: string
  ) => {
    if (!userId) {
      setMessage({ type: "error", text: "You must be logged in to apply." });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("/api/auth/applyInternship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internshipId,
          userId,
          coverLetter,
          resumeUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Applied successfully!" });
        onOpenChange(false);
        setResumeUrl("");
        setCoverLetter("");
      } else {
        setMessage({
          type: "error",
          text: data.message || data.error || "Failed to apply.",
        });
      }
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                {internship.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1 text-gray-500">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{internship.company?.name}</span>
              </div>
            </div>
            {/* Status Badge */}
            <Badge variant={internship.isActive ? "default" : "secondary"}>
              {internship.isActive ? "Active" : "Closed"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* --- SECTION 1: JOB HIGHLIGHTS --- */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-[10px] uppercase text-gray-500 font-semibold">
                Stipend
              </p>
              <div className="flex items-center gap-1 font-medium text-sm mt-0.5">
                {internship.stipend
                  ? `₹${internship.stipend.toLocaleString()}`
                  : "Unpaid"}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 font-semibold">
                Duration
              </p>
              <div className="flex items-center gap-1 font-medium text-sm mt-0.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {internship.durationWeeks} Weeks
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 font-semibold">
                Start Date
              </p>
              <div className="flex items-center gap-1 font-medium text-sm mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                {formatDate(internship.startDate)}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 font-semibold">
                Deadline
              </p>
              <div className="flex items-center gap-1 font-medium text-sm mt-0.5 text-red-600">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(internship.applicationDeadline)}
              </div>
            </div>
          </div>

          {/* --- SECTION 2: DESCRIPTION & DETAILS --- */}
          <div className="space-y-4">
            {/* About */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                About the Role
              </h4>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {internship.description}
              </p>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                Skills Required
              </h4>
              <div className="flex flex-wrap gap-2">
                {internship.skillsRequired?.map((skill: string) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1 bg-white border-gray-200"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Perks */}
            {internship.perks?.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Perks</h4>
                <div className="grid grid-cols-2 gap-2">
                  {internship.perks.map((perk: string) => (
                    <div
                      key={perk}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      {perk}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Eligibility */}
            {internship.eligibility && (
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                <h4 className="flex items-center gap-2 text-sm font-bold text-amber-900 mb-1">
                  <GraduationCap className="w-4 h-4" /> Eligibility
                </h4>
                <p className="text-sm text-amber-800">
                  {internship.eligibility}
                </p>
              </div>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* --- SECTION 3: APPLICATION FORM (Your Existing Code) --- */}
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <h4 className="text-md font-bold text-gray-900 mb-4">
              Submit Application
            </h4>

            <div className="flex flex-col gap-4 mt-2">
              {/* --- RESUME SECTION --- */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume
                </label>

                {!resumeUrl ? (
                  /* Case 1: No Resume Selected -> Show Options */

                  <div className="flex flex-col gap-3">
                    {/* Option A: Upload File */}

                    <FileUpload
                      onSuccess={(fileUrl) => {
                        setResumeUrl(fileUrl);
                        setIsUsingProfileResume(false);
                        setMessage({
                          type: "success",
                          text: "Resume uploaded successfully!",
                        });
                      }}
                      onError={(error) => {
                        setMessage({ type: "error", text: error });
                      }}
                    />

                    {/* Divider */}

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-gray-200"></div>

                      <span className="flex-shrink-0 mx-3 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        Or use existing
                      </span>

                      <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Option B: Use Profile Resume */}

                    <button
                      type="button"
                      onClick={handleUseProfileResume}
                      disabled={fetchingResume}
                      className="group relative w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-[0.98] disabled:opacity-70"
                    >
                      {fetchingResume ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      ) : (
                        <User className="w-4 h-4 text-gray-500 group-hover:text-gray-900 transition-colors" />
                      )}

                      {fetchingResume
                        ? "Fetching..."
                        : "Apply with Profile Resume"}
                    </button>
                  </div>
                ) : (
                  /* Case 2: Resume Selected -> Show Selected State */

                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-3">
                      {/* Icon changes based on source */}

                      <div
                        className={`p-2 rounded-full ${
                          isUsingProfileResume
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {isUsingProfileResume ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>

                      {/* Text Details */}

                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {isUsingProfileResume
                            ? "Profile Resume"
                            : "Uploaded File"}
                        </span>

                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
                        >
                          View Document
                        </a>
                      </div>
                    </div>

                    {/* Clear Selection Button */}

                    <button
                      type="button"
                      onClick={clearResumeSelection}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove resume"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* --- COVER LETTER SECTION --- */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why do you want to join this role?
                </label>

                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Share what excites you about this opportunity..."
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-gray-900 outline-none resize-none"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() =>
              applyToInternship(internship?.id, resumeUrl, coverLetter)
            }
            disabled={!resumeUrl || !coverLetter || loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
