import React, { useState, useEffect } from "react";
import { Zap, ExternalLink, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const tagColors = {
  FinTech: 'bg-green-500/20 text-green-300',
  HealthTech: 'bg-cyan-500/20 text-cyan-300',
  MedTech: 'bg-teal-500/20 text-teal-300',
  EdTech: 'bg-emerald-500/20 text-emerald-300',
  AgriTech: 'bg-lime-500/20 text-lime-300',
  SaaS: 'bg-blue-500/20 text-blue-300',
  DevTech: 'bg-indigo-500/20 text-indigo-300',
  SecurityTech: 'bg-red-500/20 text-red-300',
  LegalTech: 'bg-slate-500/20 text-slate-300',
  HRTech: 'bg-pink-500/20 text-pink-300',
  Other: 'bg-gray-500/20 text-gray-300',
};

const HotHiringNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get(`/api/news/insights/${today}`);
        
        const data = response.data;
        if (data?.hot_companies && data.hot_companies.length > 0) {
          const formatted = data.hot_companies.slice(0, 5).map((item, idx) => ({
            id: idx,
            headline: `${item.company} hiring for ${item.role}`,
            source: item.location || 'Remote',
            tag: item.signals?.[0] || 'Hiring',
            tagColor: tagColors[item.signals?.[0]] || 'bg-purple-500/20 text-purple-300',
            time: 'Today',
            signals: item.signals || [],
            url: '#',
          }));
          setNews(formatted);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error('Failed to fetch insights:', err);
        setError(err.message);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const getIndustryTags = () => {
    return [];
  };

  const displayNews = news.length > 0 ? news : [
    { id: 1, headline: 'No hiring data available yet', source: 'Check back later', tag: 'N/A', tagColor: 'bg-gray-500/20 text-gray-300', time: '', url: '#' }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
            <Zap size={13} className="text-yellow-400" />
            Hot in the Hiring Market
          </h3>
          <p className="text-[11px] text-white/40">
            {loading ? 'Loading...' : news.length > 0 ? 'Live hiring signals' : 'No data available'}
          </p>
        </div>
        {!loading && (
          <span className="text-[9px] uppercase tracking-widest text-white/30 border border-white/10 px-1.5 py-0.5 rounded">
            {news.length > 0 ? 'Live' : 'N/A'}
          </span>
        )}
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={20} className="animate-spin text-white/40" />
        </div>
      ) : (
        <div className="flex flex-col gap-0 flex-1 overflow-hidden">
          {displayNews.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-start gap-2.5 py-2.5 ${
                i < displayNews.length - 1 ? 'border-b border-white/5' : ''
              } group cursor-pointer ${item.url !== '#' ? 'hover:bg-white/5 rounded' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-white/90 leading-snug group-hover:text-purple-300 transition-colors line-clamp-2">
                  {item.headline}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${item.tagColor}`}>{item.tag}</span>
                  <span className="text-[10px] text-white/35">{item.source}</span>
                  {item.time && (
                    <>
                      <span className="text-[10px] text-white/25">·</span>
                      <span className="text-[10px] text-white/35">{item.time}</span>
                    </>
                  )}
                </div>
              </div>
              {item.url !== '#' && (
                <ExternalLink size={11} className="text-white/20 group-hover:text-purple-400 transition-colors flex-shrink-0 mt-1" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotHiringNews;