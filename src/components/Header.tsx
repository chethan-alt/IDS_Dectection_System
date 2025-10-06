import React from 'react';
import { Shield, Activity, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  currentTime: Date;
}

const Header: React.FC<HeaderProps> = ({ currentTime }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              CyberWatch IDS
            </h1>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-green-400">ACTIVE</span>
            </div>
            <div className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">MONITORING</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <div className="text-sm text-gray-300">System Time</div>
            <div className="font-mono text-blue-400">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-300">Date</div>
            <div className="font-mono text-blue-400">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;