import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NetworkTopology from './components/NetworkTopology';
import ThreatAlerts from './components/ThreatAlerts';
import NetworkStats from './components/NetworkStats';
import SecurityLogs from './components/SecurityLogs';
import SystemStatus from './components/SystemStatus';
import TrafficMonitor from './components/TrafficMonitor';
import AttackSimulator from './components/AttackSimulator';
import { AttackProvider } from './contexts/AttackContext';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AttackProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header currentTime={currentTime} />
      
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Network Topology - Main Visual */}
        <div className="lg:col-span-8">
          <NetworkTopology />
        </div>
        
        {/* System Status */}
        <div className="lg:col-span-4">
          <SystemStatus />
        </div>
        
        {/* Threat Alerts */}
        <div className="lg:col-span-6">
          <ThreatAlerts />
        </div>
        
        {/* Network Statistics */}
        <div className="lg:col-span-6">
          <NetworkStats />
        </div>
        
        {/* Traffic Monitor */}
        <div className="lg:col-span-7">
          <TrafficMonitor />
        </div>
        
        {/* Security Logs */}
        <div className="lg:col-span-5">
          <SecurityLogs />
        </div>
        
        {/* Attack Simulator */}
        <div className="lg:col-span-12">
          <AttackSimulator />
        </div>
      </div>
      </div>
    </AttackProvider>
  );
}

export default App;