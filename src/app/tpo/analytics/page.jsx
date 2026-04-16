"use client";
import { useState, useEffect } from "react";
import TPOPageShell from "@/component/tpo/TPOPageShell";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { Download, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";

export default function AnalyticsPage() {
  const [data, setData] = useState({
    engagementTrend: [],
    weeklyEmailData: [],
    branchFunnel: [],
    leaderboard: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/api/admin/analytics");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <TPOPageShell title="Analytics" subtitle="Deep-dive metrics on student engagement, outreach performance, and placement readiness">
        <div className="flex justify-center items-center h-64 text-gray-500">
          Loading analytics...
        </div>
      </TPOPageShell>
    );
  }

  const { engagementTrend, weeklyEmailData, branchFunnel, leaderboard } = data;

  return (
    <TPOPageShell title="Analytics" subtitle="Deep-dive metrics on student engagement, outreach performance, and placement readiness">

      {/* Action */}
      <div className="flex justify-end mb-4">
        <button className="flex items-center gap-2 text-sm text-white bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-medium">
          <Download size={14}/> Download Report
        </button>
      </div>

      {/* Trend line */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900">Student Engagement Trend — Aug 2025 to Mar 2026</h3>
          <span className="flex items-center gap-1 text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-md">
            <TrendingUp size={11}/> Real-time engagement
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-4">Active students on platform over time</p>
        <div className="h-64">
          {engagementTrend && engagementTrend.length > 0 ? (
            <ResponsiveLine
              data={engagementTrend.filter(s => s.id !== "Interviews")}
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
              legends={[{anchor:"bottom",direction:"row",translateY:46,itemWidth:140,itemHeight:14,itemTextColor:"#6B7280",symbolSize:8,symbolShape:"circle"}]}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">No data available</div>
          )}
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly email bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Weekly Email Volume (Jan – Mar 2026)</h3>
          <p className="text-xs text-gray-400 mb-4">Total cold emails sent by your cohort per week</p>
          <div className="h-56">
            {weeklyEmailData && weeklyEmailData.length > 0 ? (
              <ResponsiveBar
                data={weeklyEmailData}
                keys={["sent"]}
                indexBy="week"
                margin={{top:10,right:10,bottom:50,left:45}}
                padding={0.3}
                colors="#8B5CF6"
                borderRadius={4}
                axisBottom={{tickSize:0,tickPadding:8,tickRotation:-30}}
                axisLeft={{tickSize:0,tickPadding:8,tickValues:4}}
                enableGridX={false}
                enableLabel={false}
                theme={{textColor:"#6B7280",fontSize:10,grid:{line:{stroke:"#F3F4F6"}}}}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">No data available</div>
            )}
          </div>
        </div>

        {/* Branch distribution pie */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Active Students by Branch</h3>
          <p className="text-xs text-gray-400 mb-2">Which branches are most engaged with off-campus outreach</p>
          <div className="h-44">
            {branchFunnel && branchFunnel.length > 0 ? (
              <ResponsivePie
                data={branchFunnel}
                colors={d=>d.data.color}
                margin={{top:5,right:5,bottom:5,left:5}}
                innerRadius={0.5}
                padAngle={2}
                cornerRadius={3}
                enableArcLabels={false}
                enableArcLinkLabels={false}
                theme={{textColor:"#6B7280",fontSize:11}}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">No data available</div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1 mt-2">
            {branchFunnel?.map(b=>(
              <div key={b.id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:b.color}}/>
                <span className="text-xs text-gray-600">{b.id} <span className="font-semibold">{b.value}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engagement Score Leaderboard */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Engagement Score Leaderboard</h3>
          <p className="text-xs text-gray-400 mt-0.5">Top 5 students ranked by composite Outmail Engagement Score</p>
        </div>
        <div className="divide-y divide-gray-50">
          {leaderboard?.map((s,i)=>(
            <div key={s.name} className="px-6 py-4 flex items-center gap-5">
              <span className={`text-lg font-black w-6 text-center ${i===0?"text-yellow-400":i===1?"text-gray-400":i===2?"text-orange-400":"text-gray-200"}`}>
                {i+1}
              </span>
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 text-sm font-bold flex items-center justify-center flex-shrink-0">
                {s.name.split(" ").map(n=>n[0]).join("")}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                <p className="text-xs text-gray-400">{s.emails} emails sent</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-purple-700">{s.score}</p>
                <p className={`text-xs font-medium ${s.delta.startsWith("+")?"text-green-500":s.delta.startsWith("-")?"text-red-400":"text-gray-400"}`}>
                  {s.delta} this week
                </p>
              </div>
            </div>
          ))}
          {(!leaderboard || leaderboard.length === 0) && (
            <div className="px-6 py-4 text-center text-sm text-gray-500">No leaderboard data available</div>
          )}
        </div>
      </div>
    </TPOPageShell>
  );
}
