"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  SlidersHorizontal,
  Briefcase,
  LogOut,
  MapPin,
  Calendar,
  DollarSign,
  GraduationCap,
  Loader2,
  User,
  FileText,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

import logoImage from "@/components/Kairo_logo.jpg";
import HeroImage from "@/public/hero-student.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";

interface StudentDashboardProps {
  params: { id: string };
}

const StudentDashboard = ({ params }: StudentDashboardProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const Id = params.id;

  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );
  const [fetchingResume, setFetchingResume] = useState(false);
  const [isUsingProfileResume, setIsUsingProfileResume] = useState(false);

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(
    searchParams.get("location") || "all"
  );
  const [mode, setMode] = useState(searchParams.get("mode") || "all");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [skills, setSkills] = useState(searchParams.get("skills") || "");
  const [minPay, setMinPay] = useState(searchParams.get("minStipend") || "");
  const [maxPay, setMaxPay] = useState(searchParams.get("maxStipend") || "");

  // Apply modal state
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  // Fetch internships
  const fetchInternships = useCallback(async () => {
    try {
      setLoading(true);
      setMessage(null);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (location !== "all") params.append("location", location);
      if (mode !== "all") params.append("mode", mode);
      if (type !== "all") params.append("type", type);
      if (category !== "all") params.append("category", category);
      if (skills) params.append("skills", skills);
      if (minPay) params.append("minStipend", minPay);
      if (maxPay) params.append("maxStipend", maxPay);

      const res = await fetch(`/api/auth/findInternship?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (res.ok) {
        setInternships(data);
        router.replace(`/student_dashboard/${Id}?${params.toString()}`);
      } else {
        setInternships([]);
        setMessage({
          type: "error",
          text: data.message || "No internships found.",
        });
      }
    } catch (err) {
      console.error("Error fetching internships:", err);
      setMessage({ type: "error", text: "Failed to fetch internships." });
    } finally {
      setLoading(false);
    }
  }, [
    search,
    location,
    mode,
    type,
    category,
    skills,
    minPay,
    maxPay,
    router,
    Id,
  ]);

  const handleUseProfileResume = async () => {
    // Ensure we have a User ID (passed from props or session hook)
    // Assuming 'Id' is the variable holding the logged-in user's ID
    if (!Id) {
      toast.error("You must be logged in.");
      return;
    }

    try {
      setFetchingResume(true);

      const res = await fetch("/api/auth/profile/get-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Id }),
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
    if (!Id) {
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
          userId: Id,
          coverLetter,
          resumeUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Applied successfully!" });
        setShowApplyDialog(false);
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

  // Initial fetch
  useEffect(() => {
    fetchInternships();
  }, []);

  // Refetch when filters change (debounced)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchInternships();
    }, 500);
    return () => clearTimeout(delay);
  }, [
    search,
    location,
    mode,
    type,
    category,
    skills,
    minPay,
    maxPay,
    fetchInternships,
  ]);

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setLocation("all");
    setMode("all");
    setType("all");
    setCategory("all");
    setSkills("");
    setMinPay("");
    setMaxPay("");
    fetchInternships();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <Link href="/">
            <div className="flex items-center gap-3">
              <img
                src={logoImage.src}
                alt="Kairo Internships Logo"
                className="h-10 w-auto rounded-xl"
              />
              <h1 className="text-2xl font-semibold text-gray-800 tracking-tight"></h1>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                router.push(`/student_dashboard/${Id}/appliedInternship`)
              }
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition"
            >
              <Briefcase className="w-4 h-4" /> {/* Optional: Add an icon */}
              Applied Internships
            </button>
            <button
              onClick={() => router.push(`/profile/${Id}`)}
              className="relative"
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${Id}`}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-gray-800 hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* -------------------- HERO SECTION (Your future starts here) -------------------- */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6">
          {/* LEFT TEXT AREA */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Your <span className="text-black-700">future</span> starts here
            </h1>

            <p className="text-gray-600 mt-3 text-lg">
              25k+ Internships for freshers, students & graduates!
            </p>
          </div>

          {/* RIGHT IMAGE AREA */}
          <div className="flex-1 mt-10 lg:mt-0 flex justify-center relative">
            {/* Background decorative circles */}
            <div className="absolute -top-5 -right-5 w-40 h-40 bg-blue-100 rounded-full blur-2xl opacity-60"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-200 rounded-full blur-xl opacity-40"></div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Alert */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {message.text}
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Sidebar Filters */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:w-1/4 bg-white rounded-2xl shadow-md border border-gray-200 p-6 sticky top-20 h-fit"
          >
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-800">
                Find Your Dream Internship
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="🔍 Search role or company"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 outline-none"
              />

              <select
                title="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900"
              >
                <option value="all">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>

              <select
                title="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900"
              >
                <option value="all">All Types</option>
                <option value="REMOTE">Remote</option>
                <option value="ONSITE">Onsite</option>
                <option value="HYBRID">Hybrid</option>
              </select>

              <select
                title="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900"
              >
                <option value="all">All Modes</option>
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
              </select>

              <select
                title="categories"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900"
              >
                <option value="all">All Categories</option>
                <option value="ENGINEERING">Engineering</option>
                <option value="MARKETING">Marketing</option>
                <option value="DESIGN">Design</option>
                <option value="SALES">Sales</option>
              </select>

              <input
                type="text"
                placeholder="💡 Skills (e.g. React, Figma)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-gray-900 outline-none"
              />

              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPay}
                  onChange={(e) => setMinPay(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-gray-900"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPay}
                  onChange={(e) => setMaxPay(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-600 text-sm">
                  {loading
                    ? "Loading internships..."
                    : `${internships.length} internship${
                        internships.length !== 1 ? "s" : ""
                      } found`}
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.section>

          {/* Internship Cards */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-3/4 grid gap-6 md:grid-cols-2 lg:grid-cols-2"
          >
            {loading && (
              <div className="col-span-full text-center py-20">
                <Loader2 className="w-8 h-8 text-gray-500 mx-auto animate-spin mb-3" />
                <p className="text-gray-500">Fetching internships...</p>
              </div>
            )}
            {!loading &&
              internships.map((internship) => (
                <motion.div
                  key={internship.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg p-6 transition-all flex flex-col h-full"
                >
                  {/* Header: Title & Company */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {internship.title}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium mt-1">
                      {internship.company?.name || "Unknown Company"}
                    </p>
                  </div>

                  {/* Metadata Icons Row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-gray-500 text-xs mb-4">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                      <MapPin className="w-3.5 h-3.5" />
                      {internship.type === "REMOTE"
                        ? "Remote"
                        : internship.location}
                    </span>

                    {internship.durationWeeks && (
                      <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        <Calendar className="w-3.5 h-3.5" />
                        {internship.durationWeeks} Weeks
                      </span>
                    )}

                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                      ₹
                      {internship.stipend
                        ? `${internship.stipend.toLocaleString()}`
                        : "Unpaid"}
                    </span>
                  </div>

                  {/* Eligibility Section (Highlighted) */}
                  {internship.eligibility && (
                    <div className="mb-3 flex items-start gap-2 text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-100">
                      <GraduationCap className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <span className="font-medium line-clamp-2">
                        {internship.eligibility}
                      </span>
                    </div>
                  )}

                  {/* Description Snippet */}
                  <div className="mb-4 flex-grow">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {internship.description}
                    </p>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {internship.skillsRequired
                      ?.slice(0, 3)
                      .map((skill: string, i: any) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100"
                        >
                          {skill}
                        </span>
                      ))}
                    {internship.skillsRequired?.length > 3 && (
                      <span className="text-[10px] text-gray-400 py-1 px-1">
                        +{internship.skillsRequired.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => {
                      setSelectedInternship(internship);
                      setShowApplyDialog(true);
                    }}
                    className="w-full mt-auto bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2 group"
                    disabled={loading}
                  >
                    Apply Now
                  </button>
                </motion.div>
              ))}
          </motion.section>
        </div>
      </main>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Apply for {selectedInternship?.title || "this internship"}
            </DialogTitle>
          </DialogHeader>

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

          <DialogFooter className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                applyToInternship(
                  selectedInternship?.id,
                  resumeUrl,
                  coverLetter
                )
              }
              disabled={!resumeUrl || !coverLetter || loading}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -------------------- TOP COMPANIES AUTO-SCROLLING SECTION -------------------- */}
      <section className="mt-10 w-full overflow-hidden">
        <h2 className="text-center text-3xl font-semibold text-gray-900">
          Top Companies Listing on <span className="text-black-600">KAIRO</span>
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Find jobs that fit your career aspirations.
        </p>

        {/* Scrolling container */}
        <div className="relative w-full overflow-hidden mt-10">
          <div className="flex w-max animate-scroll whitespace-nowrap gap-8">
            {/* Duplicate logos for seamless infinite scroll */}
            {[
              "/comapnies/Apple.png",
              "/comapnies/Amazon.png",
              "/comapnies/mahindra.png",
              "/comapnies/Tata.png",
              "/comapnies/Reliance.png",
              "/comapnies/google.png",
              "/comapnies/TCS.png",
              "/comapnies/LT.png",
              "/comapnies/Adani.png",
              "/comapnies/INFOSYS.png",
            ].map((logo, idx) => (
              <div
                key={`dup-${idx}`}
                className="min-w-[160px] h-[90px] bg-white rounded-xl shadow-md flex items-center justify-center border border-gray-200 p-4 hover:shadow-lg transition"
              >
                <img
                  src={logo}
                  alt="Company Logo"
                  className="object-contain"
                  style={{ width: "80px", height: "60px" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {/* -------------------- FOOTER -------------------- */}

      <footer className="mt-20 w-full bg-slate-900 text-gray-300 py-10 px-6 animate-fadeInUp delay-300">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">
              About Kairo
            </h3>
            <p className="text-sm leading-relaxed">
              Kairo connects applicants and recruiters with intelligent
              matching, helping both sides grow faster and smarter.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/signin" className="hover:text-white">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Contact</h3>
            <p className="text-sm">Email: support@kairo.com</p>
            <p className="text-sm">Phone: +1 234 567 890</p>
          </div>
        </div>

        <div className="mt-10 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-200">Kairo</span> — All
          rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;
