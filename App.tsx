import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { InputPortal } from './components/InputPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { UserRole, SubmissionRecord } from './types';
import { INITIAL_RECORDS } from './constants';

const App: React.FC = () => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [records, setRecords] = useState<SubmissionRecord[]>([]);

  // Simulate loading from a database on mount
  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem('gad_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        setRecords(INITIAL_RECORDS);
      }
    } else {
      setRecords(INITIAL_RECORDS);
    }
  }, []);

  // Save to localStorage whenever records change (Simulating DB persist)
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('gad_records', JSON.stringify(records));
    }
  }, [records]);

  const handleLogin = (role: UserRole) => {
    setCurrentUserRole(role);
  };

  const handleLogout = () => {
    setCurrentUserRole(null);
  };

  const handleSubmitRecord = (newRecord: SubmissionRecord) => {
    setRecords(prev => [newRecord, ...prev]);
  };

  // Simple Router Logic based on State
  if (!currentUserRole) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (currentUserRole === UserRole.INPUTER) {
    return <InputPortal onLogout={handleLogout} onSubmit={handleSubmitRecord} />;
  }

  if (currentUserRole === UserRole.ADMIN) {
    return <AdminDashboard records={records} onLogout={handleLogout} />;
  }

  return <div>Unknown State</div>;
};

export default App;
