"use client";

import { motion } from "framer-motion";
import { 
  MapPin, Calendar, Clock, DollarSign, Users, 
  Briefcase, Timer, ArrowRight 
} from "lucide-react";
import { format } from "date-fns"; // Standard date formatting lib (or use native JS)

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper to format Enum strings (e.g., "FULL_TIME" -> "Full Time")
const formatEnum = (str: string) => {
  return str?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

interface InternshipCardProps {
  internship: any; // Replace with your Prisma Type definition
  onApplyClick: (internship: any) => void;
}

export default function InternshipCard({ internship, onApplyClick }: InternshipCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {internship.title}
              </h3>
              <p className="text-sm font-medium text-gray-500 mt-1">
                {internship.company?.name || "Unknown Company"}
              </p>
            </div>
            {/* Optional: Company Logo could go here */}
          </div>
        </div>

        {/* Key Details Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-gray-600 mb-6">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate">{internship.type === "REMOTE" ? "Remote" : internship.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
            <span>{formatEnum(internship.mode)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{internship.durationWeeks} Weeks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>
              {internship.stipend ? formatCurrency(internship.stipend) : "Unpaid"}
            </span>
          </div>
        </div>

        {/* Skills (Pills) */}
        <div className="flex flex-wrap gap-2 mb-6">
          {internship.skillsRequired?.slice(0, 3).map((skill: string, i: number) => (
            <span
              key={i}
              className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700 bg-blue-50 border border-blue-100 rounded-full"
            >
              {skill}
            </span>
          ))}
          {internship.skillsRequired?.length > 3 && (
            <span className="px-2 py-1 text-[10px] text-gray-500 bg-gray-50 rounded-full">
              +{internship.skillsRequired.length - 3}
            </span>
          )}
        </div>

        {/* Footer Metrics */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{internship.applicationsCount} Applicants</span>
          </div>
          
          {internship.applicationDeadline && (
             <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded">
               <Timer className="w-3.5 h-3.5" />
               <span>By {new Date(internship.applicationDeadline).toLocaleDateString()}</span>
             </div>
          )}
        </div>
      </div>

      {/* Action Button (Full Width Bottom) */}
      <button
        onClick={() => onApplyClick(internship)}
        className="w-full bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-900 text-sm font-medium py-3 transition-colors flex items-center justify-center gap-2 border-t border-gray-100"
      >
        View Details & Apply
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}