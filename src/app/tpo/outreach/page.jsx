"use client";
import { useState, useEffect } from "react";
import TPOPageShell from "@/component/tpo/TPOPageShell";
import { ResponsiveLine } from "@nivo/line";
import { Mail } from "lucide-react";
import { api } from "@/lib/api";

export default function OutreachPage() {
  const [data, setData] = useState({
    monthlySent: [],
    openByDayData: [],
    topTemplates: [],
    topStudents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutreach = async () => {
      try {
        const res = await api.get("/api/admin/outreach");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch outreach data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOutreach();
  }, []);

  if (loading) {
    return (
      <TPOPageShell title="Cold Outreach" subtitle="College-wide email campaign performance and recruiter engagement metrics">
        <div className="flex justify-center items-center h-64 text-gray-500">Loading outreach data...</div>
      </TPOPageShell>
    );
  }

  const { monthlySent, topTemplates, topStudents } = data;

  return (
    <TPOPageShell title="Cold Outreach" subtitle="College-wide email campaign performance and recruiter engagement metrics">

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon:Mail,                  label:"Total Emails Sent",    value:stats?.totalEmailsSent?.toLocaleString() || "0", sub:"Across all students",   color:"purple" },
        ].map(({icon:Icon,label,value,sub,color})=>(
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className={`inline-flex p-2.5 rounded-lg bg-${color}-50 mb-3`}>
              <Icon size={16} className={`text-${color}-600`}/>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs font-medium text-gray-600 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Monthly Email Volume</h3>
          <p className="text-xs text-gray-400 mb-4">Last 6 Months</p>
          <div className="h-64">
            {monthlySent && monthlySent.length > 0 ? (
              <ResponsiveLine
                data={monthlySent.filter(s => s.id === "Emails Sent")}
                margin={{top:10,right:20,bottom:50,left:50}}
                axisBottom={{tickSize:0,tickPadding:10}}
                axisLeft={{tickSize:0,tickPadding:8,tickValues:5}}
                colors={d=>d.color}
                curve="monotoneX"
                enablePoints
                pointSize={7}
                pointBorderWidth={2}
                pointBorderColor={{from:"serieColor"}}
                enableGridX={false}
                theme={{textColor:"#6B7280",fontSize:11,grid:{line:{stroke:"#F3F4F6"}}}}
                legends={[{anchor:"bottom",direction:"row",translateY:46,itemWidth:120,itemHeight:14,itemTextColor:"#6B7280",symbolSize:8,symbolShape:"circle"}]}
              />
            ) : (
              <div className="h-full flex justify-center items-center text-sm text-gray-400">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Template Performance */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Email Template Performance</h3>
            <p className="text-xs text-gray-400 mt-0.5">Which templates are driving recruiter replies</p>
          </div>
          <div className="divide-y divide-gray-50">
            {topTemplates?.map((t)=>(
              <div key={t.name} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-medium text-gray-800 truncate">{t.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.sent?.toLocaleString()} emails sent</p>
                </div>
              </div>
            ))}
            {(!topTemplates || topTemplates.length === 0) && (
              <div className="px-6 py-4 text-center text-sm text-gray-500">No data available</div>
            )}
          </div>
        </div>

        {/* Top Students */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Top Outreach Performers</h3>
            <p className="text-xs text-gray-400 mt-0.5">Students with highest recruiter reply rates</p>
          </div>
          <div className="divide-y divide-gray-50">
            {topStudents?.map((s,i)=>(
              <div key={s.name} className="px-6 py-4 flex items-center gap-4">
                <span className="text-lg font-bold text-gray-200 w-6 text-center">{i+1}</span>
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {s.name.split(" ").map(n=>n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.emails} emails sent</p>
                </div>
              </div>
            ))}
            {(!topStudents || topStudents.length === 0) && (
              <div className="px-6 py-4 text-center text-sm text-gray-500">No data available</div>
            )}
          </div>
        </div>
      </div>
    </TPOPageShell>
  );
}
