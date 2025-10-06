import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Clock, Shield } from 'lucide-react';

interface ThreatAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  source: string;
  timestamp: Date;
  status: 'new' | 'investigating' | 'resolved';
}

const ThreatAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<ThreatAlert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'Suspicious Login Attempt',
      description: 'Multiple failed login attempts detected from IP 192.168.1.100',
      source: 'Authentication System',
      timestamp: new Date(Date.now() - 300000),
      status: 'new'
    },
    {
      id: '2',
      type: 'high',
      title: 'Port Scan Detected',
      description: 'Extensive port scanning activity from external IP',
      source: 'Network Monitor',
      timestamp: new Date(Date.now() - 600000),
      status: 'investigating'
    },
    {
      id: '3',
      type: 'medium',
      title: 'Unusual Traffic Pattern',
      description: 'Abnormal data transfer volume detected on port 443',
      source: 'Traffic Analyzer',
      timestamp: new Date(Date.now() - 900000),
      status: 'new'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new alerts
      if (Math.random() < 0.3) {
        const newAlert: ThreatAlert = {
          id: Date.now().toString(),
          type: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as any,
          title: [
            'Malware Detected',
            'DDoS Attack Attempt',
            'Unauthorized Access',
            'Suspicious File Transfer',
            'Brute Force Attack'
          ][Math.floor(Math.random() * 5)],
          description: 'Automated threat detection triggered security alert',
          source: ['Firewall', 'IDS Engine', 'Endpoint Protection', 'Network Monitor'][Math.floor(Math.random() * 4)],
          timestamp: new Date(),
          status: 'new'
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-500/10 text-red-400';
      case 'high': return 'border-orange-500 bg-orange-500/10 text-orange-400';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
      case 'low': return 'border-blue-500 bg-blue-500/10 text-blue-400';
      default: return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
        Threat Alerts
        {alerts.filter(a => a.status === 'new').length > 0 && (
          <span className="ml-2 px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full animate-pulse">
            {alerts.filter(a => a.status === 'new').length} New
          </span>
        )}
      </h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`border rounded-lg p-4 transition-all duration-300 ${getSeverityColor(alert.type)} ${
              alert.status === 'new' ? 'animate-pulse' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-semibold uppercase text-xs">
                    {alert.type} SEVERITY
                  </span>
                  <span className="text-xs text-gray-400">
                    {alert.source}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{alert.title}</h3>
                <p className="text-sm text-gray-300 mb-2">{alert.description}</p>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {alert.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatAlerts;