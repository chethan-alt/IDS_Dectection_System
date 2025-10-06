import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface NetworkStat {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

const NetworkStats: React.FC = () => {
  const [stats, setStats] = useState<NetworkStat[]>([
    { label: 'Bandwidth Usage', value: 78.5, unit: 'Mbps', trend: 'up', change: 12.3 },
    { label: 'Active Connections', value: 1247, unit: '', trend: 'up', change: 8.7 },
    { label: 'Blocked Threats', value: 34, unit: '', trend: 'down', change: -5.2 },
    { label: 'CPU Usage', value: 43.2, unit: '%', trend: 'stable', change: 0.8 },
    { label: 'Memory Usage', value: 67.8, unit: '%', trend: 'up', change: 3.4 },
    { label: 'Disk I/O', value: 156.7, unit: 'MB/s', trend: 'down', change: -2.1 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          value: stat.value + (Math.random() - 0.5) * 10,
          change: (Math.random() - 0.5) * 20,
          trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable'
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-yellow-400" />
        Network Statistics
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded border border-gray-700 p-4 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">{stat.label}</span>
              {getTrendIcon(stat.trend)}
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value.toFixed(1)}
              <span className="text-sm font-normal text-gray-400 ml-1">
                {stat.unit}
              </span>
            </div>
            <div className={`text-xs flex items-center ${getTrendColor(stat.trend)}`}>
              {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
              <span className="text-gray-500 ml-1">from last hour</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkStats;