import React, { useState, useEffect } from 'react';
import { Shield, Zap, AlertTriangle, CheckCircle, XCircle, Play, Square, Settings } from 'lucide-react';
import { useAttackContext } from '../contexts/AttackContext';

interface Attack {
  id: string;
  type: 'sql_injection' | 'ddos' | 'brute_force' | 'port_scan';
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  duration: number;
  isActive: boolean;
  detected: boolean;
  blocked: boolean;
  startTime?: Date;
  progress: number;
  customParams?: {
    intensity?: number;
    targetPort?: number;
    requestCount?: number;
    duration?: number;
  };
}

interface DetectionLog {
  id: string;
  timestamp: Date;
  attackType: string;
  action: 'detected' | 'blocked' | 'mitigated';
  details: string;
  sourceIP: string;
}

const AttackSimulator: React.FC = () => {
  const { addAttack, updateAttack, removeAttack } = useAttackContext();

  const [attacks, setAttacks] = useState<Attack[]>([
    {
      id: '1',
      type: 'sql_injection',
      name: 'SQL Injection Attack',
      description: 'Simulates malicious SQL queries attempting to access database',
      severity: 'high',
      duration: 10000,
      isActive: false,
      detected: false,
      blocked: false,
      progress: 0,
      customParams: { intensity: 50, requestCount: 100, duration: 10 }
    },
    {
      id: '2',
      type: 'ddos',
      name: 'DDoS Attack',
      description: 'Simulates distributed denial of service attack with high traffic volume',
      severity: 'critical',
      duration: 15000,
      isActive: false,
      detected: false,
      blocked: false,
      progress: 0,
      customParams: { intensity: 80, requestCount: 10000, duration: 15 }
    },
    {
      id: '3',
      type: 'brute_force',
      name: 'Brute Force Attack',
      description: 'Simulates repeated login attempts with different credentials',
      severity: 'medium',
      duration: 8000,
      isActive: false,
      detected: false,
      blocked: false,
      progress: 0,
      customParams: { intensity: 30, requestCount: 50, duration: 8 }
    },
    {
      id: '4',
      type: 'port_scan',
      name: 'Port Scanning',
      description: 'Simulates systematic scanning of network ports',
      severity: 'low',
      duration: 12000,
      isActive: false,
      detected: false,
      blocked: false,
      progress: 0,
      customParams: { intensity: 20, targetPort: 80, requestCount: 200, duration: 12 }
    }
  ]);

  const [detectionLogs, setDetectionLogs] = useState<DetectionLog[]>([]);
  const [systemStatus, setSystemStatus] = useState<'secure' | 'under_attack' | 'mitigating'>('secure');
  const [showCustomInputs, setShowCustomInputs] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setAttacks(prevAttacks => 
        prevAttacks.map(attack => {
          if (attack.isActive) {
            const newProgress = Math.min(100, attack.progress + (100 / (attack.duration / 100)));
            
            // Detection logic
            if (newProgress > 20 && !attack.detected) {
              const detectionTime = Math.random() * 3000 + 1000; // 1-4 seconds
              setTimeout(() => {
                setAttacks(prev => prev.map(a =>
                  a.id === attack.id ? { ...a, detected: true } : a
                ));

                updateAttack(attack.id, { detected: true, progress: newProgress });
                addDetectionLog(attack, 'detected');
                setSystemStatus('under_attack');
              }, detectionTime);
            } else if (attack.isActive) {
              updateAttack(attack.id, { progress: newProgress });
            }
            
            // Blocking logic
            if (newProgress > 40 && attack.detected && !attack.blocked) {
              const blockTime = Math.random() * 2000 + 500; // 0.5-2.5 seconds
              setTimeout(() => {
                setAttacks(prev => prev.map(a =>
                  a.id === attack.id ? { ...a, blocked: true } : a
                ));

                updateAttack(attack.id, { blocked: true, progress: newProgress });
                addDetectionLog(attack, 'blocked');
                setSystemStatus('mitigating');
              }, blockTime);
            }
            
            // Complete attack
            if (newProgress >= 100) {
              addDetectionLog(attack, 'mitigated');
              removeAttack(attack.id);
              setTimeout(() => {
                setSystemStatus('secure');
              }, 2000);

              return {
                ...attack,
                isActive: false,
                progress: 0,
                detected: false,
                blocked: false
              };
            }
            
            return { ...attack, progress: newProgress };
          }
          return attack;
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const addDetectionLog = (attack: Attack, action: 'detected' | 'blocked' | 'mitigated') => {
    const log: DetectionLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      attackType: attack.name,
      action,
      details: getActionDetails(attack, action),
      sourceIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    };
    
    setDetectionLogs(prev => [log, ...prev.slice(0, 9)]);
  };

  const getActionDetails = (attack: Attack, action: string) => {
    const details = {
      sql_injection: {
        detected: 'Malicious SQL patterns detected in HTTP requests',
        blocked: 'SQL injection attempt blocked by WAF',
        mitigated: 'Database queries sanitized and threat neutralized'
      },
      ddos: {
        detected: 'Abnormal traffic spike detected from multiple sources',
        blocked: 'Rate limiting activated, suspicious IPs blocked',
        mitigated: 'Traffic normalized, DDoS attack successfully mitigated'
      },
      brute_force: {
        detected: 'Multiple failed authentication attempts detected',
        blocked: 'Account temporarily locked, IP address blacklisted',
        mitigated: 'Brute force attack stopped, security measures activated'
      },
      port_scan: {
        detected: 'Systematic port scanning activity identified',
        blocked: 'Port scan blocked by firewall rules',
        mitigated: 'Network ports secured, scanning attempt neutralized'
      }
    };
    
    return details[attack.type][action] || 'Security action completed';
  };

  const generateAttackPath = (attackType: string): { source: string; target: string; path: string[] } => {
    const paths = {
      sql_injection: {
        source: 'mobile-1',
        target: 'database-1',
        path: ['mobile-1', 'ap-1', 'router-1', 'server-1', 'database-1']
      },
      ddos: {
        source: 'internet',
        target: 'server-1',
        path: ['internet', 'firewall-1', 'router-1', 'server-1']
      },
      brute_force: {
        source: 'desktop-3',
        target: 'server-1',
        path: ['desktop-3', 'ap-1', 'router-1', 'server-1']
      },
      port_scan: {
        source: 'mobile-2',
        target: 'firewall-1',
        path: ['mobile-2', 'ap-2', 'router-1', 'firewall-1']
      }
    };

    return paths[attackType as keyof typeof paths] || paths.sql_injection;
  };

  const startAttack = (attackId: string) => {
    const attack = attacks.find(a => a.id === attackId);
    if (!attack) return;

    // Use custom duration if set
    const customDuration = attack.customParams?.duration ? attack.customParams.duration * 1000 : attack.duration;

    const attackPath = generateAttackPath(attack.type);

    setAttacks(prev => prev.map(attack =>
      attack.id === attackId
        ? { ...attack, isActive: true, startTime: new Date(), progress: 0, duration: customDuration }
        : attack
    ));

    // Add to attack context for network topology visualization
    addAttack({
      id: attackId,
      type: attack.type,
      name: attack.name,
      progress: 0,
      detected: false,
      blocked: false,
      sourceNode: attackPath.source,
      targetNode: attackPath.target,
      attackPath: attackPath.path
    });
  };

  const stopAttack = (attackId: string) => {
    setAttacks(prev => prev.map(attack =>
      attack.id === attackId
        ? { ...attack, isActive: false, progress: 0, detected: false, blocked: false }
        : attack
    ));
    setSystemStatus('secure');
    removeAttack(attackId);
  };

  const updateAttackParam = (attackId: string, param: string, value: number) => {
    setAttacks(prev => prev.map(attack => 
      attack.id === attackId 
        ? { 
            ...attack, 
            customParams: { 
              ...attack.customParams, 
              [param]: value 
            }
          }
        : attack
    ));
  };

  const toggleCustomInputs = (attackId: string) => {
    setShowCustomInputs(prev => ({
      ...prev,
      [attackId]: !prev[attackId]
    }));
  };
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10 text-red-400';
      case 'high': return 'border-orange-500 bg-orange-500/10 text-orange-400';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
      case 'low': return 'border-blue-500 bg-blue-500/10 text-blue-400';
      default: return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
  };

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case 'secure': return 'text-green-400 bg-green-500/20';
      case 'under_attack': return 'text-red-400 bg-red-500/20 animate-pulse';
      case 'mitigating': return 'text-yellow-400 bg-yellow-500/20 animate-bounce';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <Zap className="w-5 h-5 mr-2 text-purple-400" />
          Attack Simulator & Detection
        </h2>
        
        <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${getSystemStatusColor()}`}>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="uppercase">
              {systemStatus.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attack Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Simulate Attacks</h3>
          
          {attacks.map(attack => (
            <React.Fragment key={attack.id}>
              <div
                className={`border rounded-lg p-4 transition-all duration-300 ${getSeverityColor(attack.severity)} ${
                  attack.isActive ? 'animate-pulse' : ''
                }`}
              >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{attack.name}</h4>
                  <p className="text-sm text-gray-400 mt-1">{attack.description}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {attack.detected && (
                    <AlertTriangle className="w-4 h-4 text-yellow-400 animate-bounce" />
                  )}
                  {attack.blocked && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                  
                  <button
                    onClick={() => attack.isActive ? stopAttack(attack.id) : startAttack(attack.id)}
                    className={`p-2 rounded transition-colors ${
                      attack.isActive 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {attack.isActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => toggleCustomInputs(attack.id)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                    disabled={attack.isActive}
                  >
                    <Settings className="w-4 h-4 text-gray-300" />
                  </button>
                </div>
              </div>

              {attack.customParams && (
                <div className="text-xs text-blue-400 mt-2 mb-2">
                  Intensity: {attack.customParams.intensity}% |
                  Requests: {attack.customParams.requestCount} |
                  Duration: {attack.customParams.duration}s
                  {attack.customParams.targetPort && ` | Port: ${attack.customParams.targetPort}`}
                </div>
              )}

              
              {attack.isActive && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{attack.progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        attack.blocked ? 'bg-green-400' : 
                        attack.detected ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${attack.progress}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs">
                    <div className={`flex items-center space-x-1 ${attack.detected ? 'text-yellow-400' : 'text-gray-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${attack.detected ? 'bg-yellow-400 animate-pulse' : 'bg-gray-500'}`} />
                      <span>Detected</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${attack.blocked ? 'text-green-400' : 'text-gray-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${attack.blocked ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                      <span>Blocked</span>
                    </div>
                  </div>
                </div>
              )}
              </div>

              {/* Custom Input Panel */}
              {showCustomInputs[attack.id] && (
              <div className="mt-4 p-4 bg-gray-900 rounded border border-gray-600">
                <h5 className="text-sm font-semibold text-gray-300 mb-3">Attack Parameters</h5>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Intensity (%)
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={attack.customParams?.intensity || 50}
                      onChange={(e) => updateAttackParam(attack.id, 'intensity', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      disabled={attack.isActive}
                    />
                    <div className="text-xs text-center text-gray-400 mt-1">
                      {attack.customParams?.intensity || 50}%
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={attack.customParams?.duration || 10}
                      onChange={(e) => updateAttackParam(attack.id, 'duration', parseInt(e.target.value))}
                      className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                      disabled={attack.isActive}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">
                      Request Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50000"
                      value={attack.customParams?.requestCount || 100}
                      onChange={(e) => updateAttackParam(attack.id, 'requestCount', parseInt(e.target.value))}
                      className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                      disabled={attack.isActive}
                    />
                  </div>
                  
                  {attack.type === 'port_scan' && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Target Port
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="65535"
                        value={attack.customParams?.targetPort || 80}
                        onChange={(e) => updateAttackParam(attack.id, 'targetPort', parseInt(e.target.value))}
                        className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                        disabled={attack.isActive}
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-300">
                  <strong>Note:</strong> Higher intensity and request counts increase detection probability. 
                  Adjust parameters to simulate different attack scenarios.
                </div>
              </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Detection Logs */}
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Detection & Mitigation Logs</h3>
          
          <div className="bg-gray-900 rounded border border-gray-700 p-4 max-h-96 overflow-y-auto">
            {detectionLogs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No security events detected</p>
                <p className="text-sm">Start an attack simulation to see logs</p>
              </div>
            ) : (
              <div className="space-y-3">
                {detectionLogs.map(log => (
                  <div
                    key={log.id}
                    className={`p-3 rounded border-l-4 ${
                      log.action === 'detected' ? 'border-yellow-400 bg-yellow-500/10' :
                      log.action === 'blocked' ? 'border-red-400 bg-red-500/10' :
                      'border-green-400 bg-green-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-semibold uppercase ${
                        log.action === 'detected' ? 'text-yellow-400' :
                        log.action === 'blocked' ? 'text-red-400' :
                        'text-green-400'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-white mb-1">
                      {log.attackType}
                    </div>
                    <div className="text-xs text-gray-300 mb-2">
                      {log.details}
                    </div>
                    <div className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded inline-block">
                      Source: {log.sourceIP}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackSimulator;