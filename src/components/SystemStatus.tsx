import React, { useState, useEffect } from 'react';
import { Server, HardDrive, Cpu, MemoryStick, Thermometer } from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  status: 'normal' | 'warning' | 'critical';
  icon: any;
}

const SystemStatus: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { name: 'CPU Temperature', value: 62, status: 'normal', icon: Thermometer },
    { name: 'CPU Usage', value: 45, status: 'normal', icon: Cpu },
    { name: 'RAM Usage', value: 68, status: 'warning', icon: MemoryStick },
    { name: 'Disk Usage', value: 82, status: 'warning', icon: HardDrive },
  ]);

  const [serviceStatus, setServiceStatus] = useState([
    { name: 'IDS Engine', status: 'online', uptime: '99.8%' },
    { name: 'Firewall', status: 'online', uptime: '100%' },
    { name: 'Log Analyzer', status: 'online', uptime: '98.4%' },
    { name: 'Threat Database', status: 'updating', uptime: '99.2%' },
    { name: 'Network Scanner', status: 'offline', uptime: '95.1%' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => 
        prev.map(metric => {
          const newValue = Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10));
          return {
            ...metric,
            value: newValue,
            status: newValue > 80 ? 'critical' : newValue > 60 ? 'warning' : 'normal'
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400 border-green-400';
      case 'warning': return 'text-yellow-400 border-yellow-400';
      case 'critical': return 'text-red-400 border-red-400';
      case 'online': return 'text-green-400';
      case 'updating': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'updating': return 'bg-yellow-400';
      case 'offline': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Metrics */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Server className="w-5 h-5 mr-2 text-blue-400" />
          System Metrics
        </h2>
        
        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <div key={index} className="bg-gray-900 rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`w-4 h-4 ${getStatusColor(metric.status)}`} />
                    <span className="text-sm">{metric.name}</span>
                  </div>
                  <span className={`text-sm font-semibold ${getStatusColor(metric.status)}`}>
                    {metric.value.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metric.status === 'critical' ? 'bg-red-400' :
                      metric.status === 'warning' ? 'bg-yellow-400' : 'bg-green-400'
                    } ${metric.status === 'critical' ? 'animate-pulse' : ''}`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold mb-4">Service Status</h2>
        
        <div className="space-y-3">
          {serviceStatus.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-900 rounded">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusBg(service.status)} ${
                  service.status === 'online' ? 'animate-pulse' : 
                  service.status === 'updating' ? 'animate-bounce' : ''
                }`} />
                <span className="font-medium">{service.name}</span>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold capitalize ${getStatusColor(service.status)}`}>
                  {service.status}
                </div>
                <div className="text-xs text-gray-400">
                  Uptime: {service.uptime}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;