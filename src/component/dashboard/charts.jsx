import { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { api } from '@/lib/api';
import { Loader2, Inbox } from 'lucide-react';

const EmptyState = ({ message = "No data available to show" }) => (
  <div className="flex flex-col items-center justify-center h-full gap-2">
    <Inbox size={32} className="text-gray-200" />
    <p className="text-sm text-gray-400 font-medium">{message}</p>
  </div>
);

export function LineChart({ data, loading }) {
  if (loading) return <div className="h-60 flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" /></div>;
  if (!data || data.length === 0 || data[0].data.every(d => d.y === 0)) return <div className="h-60"><EmptyState /></div>;

  return (
    <div className="h-60">
      <ResponsiveLine
        data={data}
        margin={{ top: 10, right: 20, bottom: 50, left: 40 }}
        axisBottom={{ tickRotation: -30 }}
        colors={['#6c00ff', '#ad46ff', '#4F21A1']}
        theme={{ textColor: '#333' }}
        curve="monotoneX"
        enablePoints={true}
        pointSize={6}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
      />
    </div>
  );
}

export function BarChart({ data, loading }) {
  if (loading) return <div className="h-60 flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" /></div>;
  if (!data || data.length === 0) return <div className="h-60"><EmptyState /></div>;

  return (
    <div className="h-60">
      <ResponsiveBar
        data={data}
        keys={['value']}
        indexBy="category"
        margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
        padding={0.3}
        colors="#A46EDB"
        theme={{ textColor: '#333' }}
      />
    </div>
  );
}

export function PieChart({ data, loading }) {
  if (loading) return <div className="h-60 flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" /></div>;
  if (!data || data.length === 0) return <div className="h-60"><EmptyState /></div>;

  return (
    <div className="h-60">
      <ResponsivePie
        data={data}
        colors={['#4F21A1', '#6B1C9A', '#A46EDB', '#D4BBF0']}
        margin={{ top: 10, bottom: 60 }}
        innerRadius={0.5}
        theme={{ textColor: '#333' }}
        enableArcLabels={false}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 80,
            itemHeight: 18,
            itemTextColor: '#333',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 10,
            symbolShape: 'circle',
          }
        ]}
      />
    </div>
  );
}

export default function Charts({ userRole = 'STUDENT' }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/api/student/analytics');
        setAnalytics(response.data.analytics);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">
          My Application Pulse
        </h3>
        <LineChart data={analytics?.monthlyActivity} loading={loading} />
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">
          Outreach by Domain
        </h3>
        <BarChart data={analytics?.categoryDistribution} loading={loading} />
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">
          Fulfillment Status
        </h3>
        <PieChart data={analytics?.statusDistribution} loading={loading} />
      </div>
    </div>
  );
}

