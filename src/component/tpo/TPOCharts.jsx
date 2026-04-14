"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function TPOCharts({ stats }) {
  if (!stats || !stats.outreachActivity) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-gray-900">Email Activity — Last 7 Days</h3>
          <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">Last 7 Days</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">Total emails sent by your students</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats.outreachActivity}
              margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 11 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 11 }}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#7C3AED', fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ color: '#6B7280', fontSize: '12px', marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="sent" 
                stroke="#7C3AED" 
                strokeWidth={2} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#7C3AED' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#7C3AED' }}
                name="Emails Sent"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
