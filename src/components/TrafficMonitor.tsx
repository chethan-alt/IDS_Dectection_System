import React, { useState, useEffect } from 'react';
import { Globe, ArrowUp, ArrowDown, Filter, Activity } from 'lucide-react';

interface TrafficData {
  timestamp: Date;
  inbound: number;
  outbound: number;
  protocols: {
    http: number;
    https: number;
    ftp: number;
    ssh: number;
    other: number;
  };
}

const TrafficMonitor: React.FC = () => {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [filterProtocol, setFilterProtocol] = useState('all');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Initialize with some data
    const initialData: TrafficData[] = [];
    for (let i = 0; i < 30; i++) {
      initialData.push({
        timestamp: new Date(Date.now() - (30 - i) * 1000),
        inbound: Math.random() * 100 + 20,
        outbound: Math.random() * 80 + 10,
        protocols: {
          http: Math.random() * 30,
          https: Math.random() * 60 + 20,
          ftp: Math.random() * 10,
          ssh: Math.random() * 15,
          other: Math.random() * 20
        }
      });
    }
    setTrafficData(initialData);

    const interval = setInterval(() => {
      if (isActive) {
        const newData: TrafficData = {
          timestamp: new Date(),
          inbound: Math.random() * 100 + 20,
          outbound: Math.random() * 80 + 10,
          protocols: {
            http: Math.random() * 30,
            https: Math.random() * 60 + 20,
            ftp: Math.random() * 10,
            ssh: Math.random() * 15,
            other: Math.random() * 20
          }
        };
        
        setTrafficData(prev => [...prev.slice(-29), newData]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const currentTraffic = trafficData[trafficData.length - 1];
  const maxTraffic = Math.max(...trafficData.map(d => Math.max(d.inbound, d.outbound)));
  
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <Globe className="w-5 h-5 mr-2 text-green-400" />
          Traffic Monitor
          <div className={`ml-2 w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
        </h2>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {isActive ? 'LIVE' : 'PAUSED'}
          </button>
          
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
          </select>
          
          <select
            value={filterProtocol}
            onChange={(e) => setFilterProtocol(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Protocols</option>
            <option value="http">HTTP</option>
            <option value="https">HTTPS</option>
            <option value="ftp">FTP</option>
            <option value="ssh">SSH</option>
          </select>
        </div>
      </div>
      
      {/* Current Traffic Stats */}
      {currentTraffic && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 rounded p-4 border border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Inbound</span>
              <ArrowDown className="w-4 h-4 text-green-400 animate-bounce" />
            </div>
            <div className="text-xl font-bold text-green-400">
              {currentTraffic.inbound.toFixed(1)} <span className="text-sm">Mbps</span>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded p-4 border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Outbound</span>
              <ArrowUp className="w-4 h-4 text-blue-400 animate-bounce" />
            </div>
            <div className="text-xl font-bold text-blue-400">
              {currentTraffic.outbound.toFixed(1)} <span className="text-sm">Mbps</span>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded p-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">HTTPS Traffic</span>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            </div>
            <div className="text-xl font-bold text-white">
              {currentTraffic.protocols.https.toFixed(0)}%
            </div>
          </div>
          
          <div className="bg-gray-900 rounded p-4 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Active Connections</span>
              <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
            </div>
            <div className="text-xl font-bold text-white">
              {Math.floor(Math.random() * 500 + 1000)}
            </div>
          </div>
        </div>
      )}
      
      {/* Real-time Traffic Chart */}
      <div className="bg-gray-900 rounded p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-400 font-semibold">Real-time Traffic Flow</span>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-400 rounded animate-pulse" />
              <span className="text-green-400">Inbound</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-400 rounded animate-pulse" />
              <span className="text-blue-400">Outbound</span>
            </div>
          </div>
        </div>
        
        <div className="relative h-32 bg-gray-800 rounded border border-gray-600 overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-between px-2 py-2">
            {trafficData.map((data, index) => (
              <div key={index} className="flex flex-col justify-end items-center space-y-1 flex-1 max-w-[3px]">
                <div
                  className="bg-gradient-to-t from-green-500 to-green-300 rounded-sm transition-all duration-300 animate-pulse"
                  style={{ 
                    height: `${Math.max(2, (data.inbound / maxTraffic) * 100)}%`,
                    width: '2px'
                  }}
                />
                <div
                  className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-sm transition-all duration-300 animate-pulse"
                  style={{ 
                    height: `${Math.max(2, (data.outbound / maxTraffic) * 100)}%`,
                    width: '2px'
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none">
            {[25, 50, 75].map(percent => (
              <div
                key={percent}
                className="absolute w-full border-t border-gray-600/30"
                style={{ bottom: `${percent}%` }}
              />
            ))}
          </div>
        </div>
        
        {/* Traffic metrics */}
        <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
          {currentTraffic && Object.entries(currentTraffic.protocols).map(([protocol, value]) => (
            <div key={protocol} className="text-center">
              <div className="text-gray-400 uppercase">{protocol}</div>
              <div className="font-bold text-white">{value.toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrafficMonitor;