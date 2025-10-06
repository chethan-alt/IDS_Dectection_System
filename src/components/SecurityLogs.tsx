import React, { useState, useEffect } from 'react';
import { FileText, Search, Download, Eye } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'critical';
  source: string;
  message: string;
  ip?: string;
}

const SecurityLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  useEffect(() => {
    // Initial logs
    const initialLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 60000),
        level: 'warning',
        source: 'Firewall',
        message: 'Blocked connection attempt from suspicious IP',
        ip: '192.168.1.100'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 120000),
        level: 'info',
        source: 'IDS',
        message: 'Network scan completed successfully',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 180000),
        level: 'error',
        source: 'Auth',
        message: 'Failed login attempt detected',
        ip: '10.0.0.45'
      }
    ];
    
    setLogs(initialLogs);

    const interval = setInterval(() => {
      const sources = ['Firewall', 'IDS', 'Auth', 'Network', 'System'];
      const levels: ('info' | 'warning' | 'error' | 'critical')[] = ['info', 'warning', 'error', 'critical'];
      const messages = [
        'Connection established from external source',
        'Malicious payload detected and blocked',
        'System resource usage threshold exceeded',
        'Unauthorized access attempt prevented',
        'Network anomaly detected in traffic pattern',
        'Security policy violation logged'
      ];

      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level: levels[Math.floor(Math.random() * levels.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        ip: Math.random() > 0.5 ? `192.168.1.${Math.floor(Math.random() * 255)}` : undefined
      };

      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'error': return 'text-red-400 bg-red-500/10';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'info': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.ip && log.ip.includes(searchTerm));
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <FileText className="w-5 h-5 mr-2 text-purple-400" />
          Security Logs
          <span className="ml-2 px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full">
            {filteredLogs.length}
          </span>
        </h2>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
        >
          <option value="all">All Levels</option>
          <option value="critical">Critical</option>
          <option value="error">Error</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
      </div>
      
      {/* Log Entries */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredLogs.map(log => (
          <div
            key={log.id}
            className="bg-gray-900 rounded p-3 border-l-2 border-gray-600 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${getLevelColor(log.level)}`}>
                  {log.level}
                </span>
                <span className="text-sm text-gray-400">{log.source}</span>
                {log.ip && (
                  <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                    {log.ip}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400 font-mono">
                {log.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-gray-300">{log.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityLogs;