import React, { useState, useEffect } from 'react';
import { Server, Monitor, Smartphone, Router, Wifi, AlertTriangle, Shield, Globe, Database, Cloud } from 'lucide-react';
import { useAttackContext } from '../contexts/AttackContext';

interface NetworkNode {
  id: string;
  name: string;
  type: 'server' | 'desktop' | 'mobile' | 'router' | 'access-point' | 'cloud' | 'database';
  status: 'safe' | 'warning' | 'danger';
  x: number;
  y: number;
  z: number;
  connections: string[];
  traffic: number;
}

interface AttackPacket {
  id: string;
  fromNode: string;
  toNode: string;
  progress: number;
  type: string;
  color: string;
}

const NetworkTopology: React.FC = () => {
  const { activeAttacks } = useAttackContext();

  const [nodes, setNodes] = useState<NetworkNode[]>([
    { id: 'internet', name: 'Internet', type: 'cloud', status: 'safe', x: 50, y: 5, z: 0, connections: ['firewall-1'], traffic: 0 },
    { id: 'firewall-1', name: 'Firewall', type: 'router', status: 'safe', x: 50, y: 18, z: 10, connections: ['router-1'], traffic: 0 },
    { id: 'router-1', name: 'Core Router', type: 'router', status: 'safe', x: 50, y: 32, z: 15, connections: ['server-1', 'database-1', 'ap-1', 'ap-2'], traffic: 0 },

    { id: 'server-1', name: 'Web Server', type: 'server', status: 'safe', x: 25, y: 48, z: 20, connections: ['desktop-1', 'desktop-2'], traffic: 0 },
    { id: 'database-1', name: 'Database', type: 'database', status: 'safe', x: 15, y: 65, z: 18, connections: [], traffic: 0 },

    { id: 'ap-1', name: 'Access Point A', type: 'access-point', status: 'safe', x: 70, y: 48, z: 20, connections: ['mobile-1', 'desktop-3'], traffic: 0 },
    { id: 'ap-2', name: 'Access Point B', type: 'access-point', status: 'safe', x: 85, y: 48, z: 20, connections: ['mobile-2', 'desktop-4'], traffic: 0 },

    { id: 'desktop-1', name: 'Workstation 1', type: 'desktop', status: 'safe', x: 18, y: 75, z: 25, connections: [], traffic: 0 },
    { id: 'desktop-2', name: 'Workstation 2', type: 'desktop', status: 'safe', x: 32, y: 80, z: 25, connections: [], traffic: 0 },
    { id: 'desktop-3', name: 'Workstation 3', type: 'desktop', status: 'safe', x: 68, y: 75, z: 25, connections: [], traffic: 0 },
    { id: 'desktop-4', name: 'Workstation 4', type: 'desktop', status: 'safe', x: 82, y: 80, z: 25, connections: [], traffic: 0 },

    { id: 'mobile-1', name: 'Mobile Device 1', type: 'mobile', status: 'safe', x: 62, y: 65, z: 22, connections: [], traffic: 0 },
    { id: 'mobile-2', name: 'Mobile Device 2', type: 'mobile', status: 'safe', x: 92, y: 65, z: 22, connections: [], traffic: 0 },
  ]);

  const [attackPackets, setAttackPackets] = useState<AttackPacket[]>([]);
  const [animatedConnections, setAnimatedConnections] = useState<Set<string>>(new Set());

  useEffect(() => {
    setNodes(prevNodes =>
      prevNodes.map(node => {
        const isUnderAttack = activeAttacks.some(attack =>
          attack.attackPath?.includes(node.id) && !attack.blocked
        );
        const isTarget = activeAttacks.some(attack => attack.targetNode === node.id);

        let status: 'safe' | 'warning' | 'danger' = 'safe';
        if (isTarget && isUnderAttack) {
          status = 'danger';
        } else if (isUnderAttack) {
          status = 'warning';
        }

        return { ...node, status };
      })
    );
  }, [activeAttacks]);

  useEffect(() => {
    if (activeAttacks.length === 0) {
      setAttackPackets([]);
      return;
    }

    const interval = setInterval(() => {
      const newPackets: AttackPacket[] = [];

      activeAttacks.forEach(attack => {
        if (attack.attackPath && attack.attackPath.length > 1 && !attack.blocked) {
          for (let i = 0; i < attack.attackPath.length - 1; i++) {
            const packetCount = attack.type === 'ddos' ? 5 : 2;

            for (let j = 0; j < packetCount; j++) {
              newPackets.push({
                id: `${attack.id}-${i}-${j}-${Date.now()}`,
                fromNode: attack.attackPath[i],
                toNode: attack.attackPath[i + 1],
                progress: Math.random(),
                type: attack.type,
                color: attack.detected ? (attack.blocked ? '#10B981' : '#F59E0B') : '#EF4444'
              });
            }
          }
        }
      });

      setAttackPackets(newPackets);
    }, 400);

    return () => clearInterval(interval);
  }, [activeAttacks]);

  useEffect(() => {
    if (activeAttacks.length > 0) return;

    const interval = setInterval(() => {
      setNodes(prevNodes =>
        prevNodes.map(node => ({
          ...node,
          traffic: Math.random() * 100
        }))
      );

      const connectionKeys = nodes.flatMap(node =>
        node.connections.map(conn => `${node.id}-${conn}`)
      );
      const randomConnection = connectionKeys[Math.floor(Math.random() * connectionKeys.length)];

      if (randomConnection) {
        setAnimatedConnections(prev => {
          const newSet = new Set(prev);
          newSet.add(randomConnection);
          setTimeout(() => {
            setAnimatedConnections(current => {
              const updated = new Set(current);
              updated.delete(randomConnection);
              return updated;
            });
          }, 2000);
          return newSet;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nodes, activeAttacks]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'server': return Server;
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'router': return Router;
      case 'access-point': return Wifi;
      case 'cloud': return Cloud;
      case 'database': return Database;
      default: return Server;
    }
  };

  const getNodeSize = (type: string, z: number) => {
    const baseSize = {
      cloud: 16,
      router: 12,
      server: 10,
      database: 10,
      'access-point': 8,
      desktop: 7,
      mobile: 6
    }[type] || 8;

    const depthScale = 1 + (z / 100);
    return baseSize * depthScale;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'from-green-500/20 to-green-600/40 border-green-400 shadow-green-500/50';
      case 'warning': return 'from-yellow-500/20 to-yellow-600/40 border-yellow-400 shadow-yellow-500/50';
      case 'danger': return 'from-red-500/20 to-red-600/40 border-red-400 shadow-red-500/50';
      default: return 'from-gray-500/20 to-gray-600/40 border-gray-400 shadow-gray-500/50';
    }
  };

  const getNodeTextColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'danger': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y, z: node.z } : null;
  };

  const getAttackTypeInfo = (type: string) => {
    switch (type) {
      case 'ddos':
        return { name: 'DDoS', color: '#EF4444' };
      case 'sql_injection':
        return { name: 'SQL Injection', color: '#F59E0B' };
      case 'brute_force':
        return { name: 'Brute Force', color: '#EF4444' };
      case 'port_scan':
        return { name: 'Port Scan', color: '#3B82F6' };
      default:
        return { name: 'Unknown', color: '#6B7280' };
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          <Globe className="w-6 h-6 mr-3 text-blue-400 animate-pulse" />
          Network Infrastructure
        </h2>

        {activeAttacks.length > 0 && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500 rounded-lg animate-pulse shadow-lg shadow-red-500/30">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm font-bold text-red-400">
              {activeAttacks.length} ACTIVE THREAT{activeAttacks.length > 1 ? 'S' : ''}
            </span>
          </div>
        )}
      </div>

      {activeAttacks.length > 0 && (
        <div className="mb-4 p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg border border-gray-700 shadow-inner">
          <div className="flex items-center justify-around text-xs font-semibold">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-red-400">ATTACKING</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50"></div>
              <span className="text-yellow-400">DETECTED</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
              <span className="text-green-400">BLOCKED</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative h-[calc(100vh-280px)] min-h-[600px] bg-gradient-to-b from-gray-950 via-gray-900 to-black rounded-xl border-2 border-gray-700 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))' }}>
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.3 }} />
              <stop offset="50%" style={{ stopColor: '#3B82F6', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0.3 }} />
            </linearGradient>
            <linearGradient id="attackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#EF4444', stopOpacity: 0.5 }} />
              <stop offset="50%" style={{ stopColor: '#EF4444', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#EF4444', stopOpacity: 0.5 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {nodes.map(node =>
            node.connections.map(connId => {
              const connectedNode = nodes.find(n => n.id === connId);
              if (!connectedNode) return null;

              const connectionKey = `${node.id}-${connId}`;
              const isAnimated = animatedConnections.has(connectionKey);

              const isAttackPath = activeAttacks.some(attack =>
                attack.attackPath?.includes(node.id) && attack.attackPath?.includes(connId)
              );

              const strokeWidth = 2 + (node.z + connectedNode.z) / 10;

              return (
                <g key={connectionKey}>
                  <line
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${connectedNode.x}%`}
                    y2={`${connectedNode.y}%`}
                    stroke={isAttackPath ? 'url(#attackGradient)' : (isAnimated ? '#3B82F6' : '#374151')}
                    strokeWidth={isAttackPath ? strokeWidth + 2 : strokeWidth}
                    strokeDasharray={isAttackPath ? '10,5' : 'none'}
                    className={isAttackPath ? 'animate-pulse' : ''}
                    opacity={isAttackPath ? 0.9 : (isAnimated ? 0.7 : 0.4)}
                    filter={isAttackPath || isAnimated ? 'url(#glow)' : 'none'}
                  />
                  {isAttackPath && (
                    <line
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${connectedNode.x}%`}
                      y2={`${connectedNode.y}%`}
                      stroke="#EF4444"
                      strokeWidth={strokeWidth + 4}
                      opacity="0.2"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })
          )}

          {attackPackets.map(packet => {
            const fromPos = getNodePosition(packet.fromNode);
            const toPos = getNodePosition(packet.toNode);

            if (!fromPos || !toPos) return null;

            const x = fromPos.x + (toPos.x - fromPos.x) * packet.progress;
            const y = fromPos.y + (toPos.y - fromPos.y) * packet.progress;
            const z = fromPos.z + (toPos.z - fromPos.z) * packet.progress;
            const scale = 1 + (z / 80);

            return (
              <g key={packet.id} filter="url(#glow)">
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={4 * scale}
                  fill={packet.color}
                  className="animate-pulse"
                  opacity="1"
                />
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={8 * scale}
                  fill={packet.color}
                  opacity="0.4"
                  className="animate-ping"
                />
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={12 * scale}
                  fill={packet.color}
                  opacity="0.2"
                />
              </g>
            );
          })}
        </svg>

        {nodes.map(node => {
          const IconComponent = getNodeIcon(node.type);
          const isAttackTarget = activeAttacks.some(attack => attack.targetNode === node.id);
          const size = getNodeSize(node.type, node.z);
          const iconSize = size * 0.6;

          return (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 hover:scale-110"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                zIndex: Math.floor(node.z)
              }}
            >
              <div className={`relative p-${Math.floor(size/3)} rounded-2xl border-2 bg-gradient-to-br ${getStatusColor(node.status)} backdrop-blur-sm transition-all duration-300 ${
                node.status === 'danger' ? 'animate-pulse shadow-2xl' : 'shadow-xl'
              }`}
              style={{
                width: `${size * 4}px`,
                height: `${size * 4}px`,
                boxShadow: node.status === 'danger' ? `0 0 30px rgba(239, 68, 68, 0.6)` :
                           node.status === 'warning' ? `0 0 20px rgba(245, 158, 11, 0.4)` :
                           `0 0 15px rgba(34, 197, 94, 0.3)`
              }}>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-2xl"></div>
                <IconComponent className={`w-full h-full ${getNodeTextColor(node.status)} relative z-10`} />

                {isAttackTarget && activeAttacks.some(a => a.targetNode === node.id && a.blocked) && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-lg shadow-green-500/50 animate-bounce">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}

                {isAttackTarget && activeAttacks.some(a => a.targetNode === node.id && !a.blocked) && (
                  <>
                    <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5 shadow-lg shadow-red-500/80">
                      <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5 animate-ping opacity-75">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                  </>
                )}

                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 text-xs font-bold whitespace-nowrap opacity-90">
                  <div className={`px-2 py-1 rounded ${getNodeTextColor(node.status)} bg-gray-900/90 border border-gray-700 shadow-lg`}>
                    {node.name}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-4 py-3 bg-gray-950/95 backdrop-blur-md border-2 border-gray-700 rounded-xl text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-2xl min-w-[200px]">
                <div className="font-bold text-white text-base mb-2 border-b border-gray-700 pb-2">{node.name}</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-blue-400 capitalize font-semibold">{node.type.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Traffic:</span>
                    <span className="text-cyan-400 font-semibold">{node.traffic.toFixed(1)} Mbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`capitalize font-bold ${
                      node.status === 'safe' ? 'text-green-400' :
                      node.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {node.status}
                    </span>
                  </div>
                </div>

                {activeAttacks.filter(a => a.targetNode === node.id).map(attack => (
                  <div key={attack.id} className="mt-3 pt-3 border-t border-red-500/30 bg-red-500/10 -mx-4 px-4 py-2">
                    <div className="text-red-400 font-bold text-sm mb-1">
                      {getAttackTypeInfo(attack.type).name}
                    </div>
                    <div className="text-xs">
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        attack.blocked ? 'bg-green-500 text-white' :
                        attack.detected ? 'bg-yellow-500 text-black' :
                        'bg-red-500 text-white'
                      }`}>
                        {attack.blocked ? '🛡️ BLOCKED' : attack.detected ? '⚠️ DETECTED' : '🚨 ACTIVE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {activeAttacks.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeAttacks.map(attack => (
            <div
              key={attack.id}
              className={`p-4 rounded-xl border-2 backdrop-blur-sm transition-all duration-300 ${
                attack.blocked ? 'bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500 shadow-lg shadow-green-500/20' :
                attack.detected ? 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/20 border-yellow-500 shadow-lg shadow-yellow-500/20' :
                'bg-gradient-to-br from-red-500/10 to-red-600/20 border-red-500 shadow-lg shadow-red-500/20 animate-pulse'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-white">{getAttackTypeInfo(attack.type).name}</span>
                <span className={`text-xs px-3 py-1.5 rounded-lg font-bold shadow-lg ${
                  attack.blocked ? 'bg-green-500 text-white' :
                  attack.detected ? 'bg-yellow-500 text-black' :
                  'bg-red-500 text-white'
                }`}>
                  {attack.blocked ? '🛡️ BLOCKED' : attack.detected ? '⚠️ DETECTED' : '🚨 ACTIVE'}
                </span>
              </div>

              <div className="text-xs text-gray-300 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Source:</span>
                  <span className="font-semibold text-blue-400">{nodes.find(n => n.id === attack.sourceNode)?.name || 'External'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Target:</span>
                  <span className="font-semibold text-red-400">{nodes.find(n => n.id === attack.targetNode)?.name || 'Unknown'}</span>
                </div>

                {attack.attackPath && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="font-bold mb-2 text-white">Attack Path:</div>
                    <div className="flex items-center flex-wrap gap-1.5">
                      {attack.attackPath.map((nodeId, idx) => (
                        <React.Fragment key={nodeId}>
                          <span className="bg-gray-700/80 px-2 py-1 rounded text-xs font-semibold border border-gray-600">
                            {nodes.find(n => n.id === nodeId)?.name || nodeId}
                          </span>
                          {idx < attack.attackPath!.length - 1 && (
                            <span className="text-red-400 font-bold">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      attack.blocked ? 'bg-gradient-to-r from-green-500 to-green-400' :
                      attack.detected ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                      'bg-gradient-to-r from-red-500 to-red-400'
                    }`}
                    style={{
                      width: `${attack.progress}%`,
                      boxShadow: attack.blocked ? '0 0 10px rgba(34, 197, 94, 0.5)' :
                                 attack.detected ? '0 0 10px rgba(245, 158, 11, 0.5)' :
                                 '0 0 10px rgba(239, 68, 68, 0.5)'
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NetworkTopology;
