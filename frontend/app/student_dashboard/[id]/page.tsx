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

import InternshipCard from "@/components/InternshipCard";
import { ApplyInternshipDialog } from "@/components/ApplyInternshipDialog";

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
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onApplyClick={(data) => {
                    setSelectedInternship(data);
                    setShowApplyDialog(true);
                  }}
                />
              ))}
          </motion.section>
        </div>
      </main>

      {/* Apply Dialog */}
      <ApplyInternshipDialog
        open={showApplyDialog}
        onOpenChange={setShowApplyDialog}
        internship={selectedInternship}
        userId={Id}
      />

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
