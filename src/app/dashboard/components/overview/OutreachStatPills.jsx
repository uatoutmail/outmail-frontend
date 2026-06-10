import React, { useState, useEffect } from "react";
import { Mail, TrendingUp, Building, FileText, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const OutreachStatPills = ({ selectedPeriod = '7' }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/analytics/outreach?period=${selectedPeriod}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching outreach stats:", err);
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedPeriod]);

  const stats = [
    {
      label: `Emails Sent (${selectedPeriod}d)`,
      value: loading ? null : data?.emailsSentPeriod ?? '0',
      icon: Mail,
      color: 'text-purple-400',
      bg: 'bg-purple-500/15',
      border: 'border-purple-500/25',
    },
    {
      label: 'Total Emails Sent',
      value: loading ? null : data?.totalEmailsSent ?? '0',
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/15',
      border: 'border-green-500/25',
    },
    {
      label: 'Companies Targeted',
      value: loading ? null : data?.companiesTargeted ?? '0',
      icon: Building,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/15',
      border: 'border-cyan-500/25',
    },
    {
      label: 'Active Outreach',
      value: loading ? null : data?.activeOutreach ?? 'None',
      icon: FileText,
      color: 'text-amber-400',
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/25',
      truncate: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} ${stat.border} border backdrop-blur-md rounded-xl p-3 flex items-center gap-3 relative overflow-hidden`}
        >
          <div className="p-2 rounded-lg bg-white/10 flex-shrink-0 relative z-10">
            <stat.icon size={15} className={stat.color} />
          </div>
          <div className="min-w-0 relative z-10 flex-1">
            <p className="text-[10px] text-white/50 uppercase tracking-wide leading-tight">{stat.label}</p>
            {stat.value === null ? (
              <div className="h-4 w-12 bg-white/10 animate-pulse rounded mt-1"></div>
            ) : (
              <p className={`text-sm font-bold mt-0.5 ${stat.color} ${stat.truncate ? 'truncate' : ''}`}>
                {stat.value}
              </p>
            )}
          </div>
          {loading && (
            <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OutreachStatPills;