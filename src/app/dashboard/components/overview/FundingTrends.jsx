import React, { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, MoreHorizontal } from "lucide-react";

const FundingTrends = ({ selectedPeriod, onPeriodChange }) => {
  const [fundingData, setFundingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState('bar');

  const fetchFundingData = async (period) => {
    setLoading(true);
    const mockData = {
      '7': [
        { industry: 'FinTech', amount: 420, color: '#8B5CF6' },
        { industry: 'HealthTech', amount: 380, color: '#06B6D4' },
        { industry: 'EdTech', amount: 290, color: '#10B981' },
        { industry: 'CleanTech', amount: 180, color: '#F59E0B' },
        { industry: 'AI/ML', amount: 350, color: '#EF4444' },
        { industry: 'SaaS', amount: 410, color: '#8B5CF6' }
      ],
      '15': [
        { industry: 'FinTech', amount: 650, color: '#8B5CF6' },
        { industry: 'HealthTech', amount: 580, color: '#06B6D4' },
        { industry: 'EdTech', amount: 390, color: '#10B981' },
        { industry: 'CleanTech', amount: 280, color: '#F59E0B' },
        { industry: 'AI/ML', amount: 520, color: '#EF4444' },
        { industry: 'SaaS', amount: 610, color: '#8B5CF6' }
      ],
      '30': [
        { industry: 'FinTech', amount: 980, color: '#8B5CF6' },
        { industry: 'HealthTech', amount: 840, color: '#06B6D4' },
        { industry: 'EdTech', amount: 620, color: '#10B981' },
        { industry: 'CleanTech', amount: 450, color: '#F59E0B' },
        { industry: 'AI/ML', amount: 780, color: '#EF4444' },
        { industry: 'SaaS', amount: 890, color: '#8B5CF6' }
      ]
    };
    
    setFundingData(mockData[period] || mockData['7']);
    setLoading(false);
  };

  useEffect(() => {
    fetchFundingData(selectedPeriod);
  }, [selectedPeriod]);

  const formatAmount = (amount) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}T`;
    }
    return `$${amount}B`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/20">
          <p className="text-gray-800 font-semibold">{label}</p>
          <p className="text-purple-600 font-bold">
            {formatAmount(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const topThreeIndustries = [...fundingData]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  const totalFunding = fundingData.reduce((acc, d) => acc + d.amount, 0);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-white shadow-xl border border-white/20 h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <TrendingUp size={14} className="text-green-400" />
            Industry Funding Trends
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50 font-semibold uppercase tracking-wide">Sample</span>
          </h3>
          <p className="text-[10px] text-white/50 mt-0.5">
            Last {selectedPeriod} days · Total&nbsp;
            <span className="text-green-400 font-bold">{formatAmount(totalFunding)}</span>
          </p>
        </div>
        <button
          onClick={() => setViewType(viewType === 'bar' ? 'pie' : 'bar')}
          className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          title={`Switch to ${viewType === 'bar' ? 'pie' : 'bar'} chart`}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white"></div>
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0 mb-2" style={{ minHeight: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              {viewType === 'bar' ? (
                <BarChart data={fundingData} margin={{ top: 4, right: 4, bottom: 30, left: -10 }} barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="industry"
                    tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 9 }}
                    angle={-35}
                    textAnchor="end"
                    height={45}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 9 }}
                    tickFormatter={formatAmount}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={52}>
                    {fundingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={fundingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={58}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {fundingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="border-t border-white/10 pt-2">
            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">Top Funded</p>
            <div className="flex flex-wrap gap-1.5">
              {topThreeIndustries.map((industry) => (
                <div
                  key={industry.industry}
                  className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5 border border-white/10"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: industry.color }}
                  />
                  <span className="text-[10px] text-white/70">{industry.industry}</span>
                  <span className="text-[10px] font-bold text-green-400">{formatAmount(industry.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FundingTrends;