import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ActiveAttack {
  id: string;
  type: 'sql_injection' | 'ddos' | 'brute_force' | 'port_scan';
  name: string;
  progress: number;
  detected: boolean;
  blocked: boolean;
  sourceNode?: string;
  targetNode?: string;
  attackPath?: string[];
}

interface AttackContextType {
  activeAttacks: ActiveAttack[];
  addAttack: (attack: ActiveAttack) => void;
  updateAttack: (id: string, updates: Partial<ActiveAttack>) => void;
  removeAttack: (id: string) => void;
}

const AttackContext = createContext<AttackContextType | undefined>(undefined);

export const useAttackContext = () => {
  const context = useContext(AttackContext);
  if (!context) {
    throw new Error('useAttackContext must be used within AttackProvider');
  }
  return context;
};

export const AttackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeAttacks, setActiveAttacks] = useState<ActiveAttack[]>([]);

  const addAttack = (attack: ActiveAttack) => {
    setActiveAttacks(prev => [...prev, attack]);
  };

  const updateAttack = (id: string, updates: Partial<ActiveAttack>) => {
    setActiveAttacks(prev =>
      prev.map(attack => (attack.id === id ? { ...attack, ...updates } : attack))
    );
  };

  const removeAttack = (id: string) => {
    setActiveAttacks(prev => prev.filter(attack => attack.id !== id));
  };

  return (
    <AttackContext.Provider value={{ activeAttacks, addAttack, updateAttack, removeAttack }}>
      {children}
    </AttackContext.Provider>
  );
};
