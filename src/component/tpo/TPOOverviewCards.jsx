"use client";
import {
  Users,
  Mail,
  BriefcaseBusiness,
  FileText,
} from "lucide-react";

const colorMap = {
  purple: { bg: "bg-purple-50", text: "text-purple-600", badge: "bg-purple-100 text-purple-700" },
  blue:   { bg: "bg-blue-50",   text: "text-blue-600",   badge: "bg-blue-100 text-blue-700" },
  green:  { bg: "bg-green-50",  text: "text-green-600",  badge: "bg-green-100 text-green-700" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", badge: "bg-orange-100 text-orange-700" },
  teal:   { bg: "bg-teal-50",   text: "text-teal-600",   badge: "bg-teal-100 text-teal-700" },
  yellow: { bg: "bg-yellow-50", text: "text-yellow-600", badge: "bg-yellow-100 text-yellow-700" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", badge: "bg-indigo-100 text-indigo-700" },
  pink:   { bg: "bg-pink-50",   text: "text-pink-600",   badge: "bg-pink-100 text-pink-700" },
};

export default function TPOOverviewCards({ stats }) {
  const cards = [
    {
      label: "Total Students on Outmail",
      value: stats?.totalStudents || 0,
      sub: "Active students",
      icon: Users,
      color: "purple",
    },
    {
      label: "Total Cold Emails Sent",
      value: stats?.totalEmailsSent || 0,
      sub: "Total outreach",
      icon: Mail,
      color: "blue",
    },
    {
      label: "Total Companies Tracked",
      value: stats?.totalCompanies || 0,
      sub: "Across all students",
      icon: BriefcaseBusiness,
      color: "orange",
    },
    {
      label: "Total Templates Created",
      value: stats?.totalTemplates || 0,
      sub: "Active templates",
      icon: FileText,
      color: "teal",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map(({ label, value, sub, icon: Icon, color }) => {
        const c = colorMap[color];
        return (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
            <div className="mb-3">
              <div className={`p-2.5 rounded-lg inline-block ${c.bg}`}>
                <Icon size={18} className={c.text} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs font-medium text-gray-600 mt-0.5 leading-tight">{label}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        );
      })}
    </div>
  );
}
