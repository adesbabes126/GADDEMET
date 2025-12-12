import React from 'react';
import { UserRole } from '../types';
import { Shield, User, Database, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Header Section (Mobile Top / Desktop Left Side) */}
        <div className="flex flex-col justify-center text-white space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/50">
              <Database className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">GADBase</h1>
          </div>
          <p className="text-indigo-200 text-lg max-w-md">
            The central repository for Gender and Development statistics. 
            Securely track, analyze, and visualize demographic data across all organizational levels.
          </p>
          <div className="h-1 w-20 bg-indigo-500 rounded-full"></div>
        </div>

        {/* Cards Section */}
        <div className="space-y-4">
          
          {/* Inputer Card */}
          <button 
            onClick={() => onLogin(UserRole.INPUTER)}
            className="w-full group bg-white hover:bg-indigo-50 p-6 rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left flex items-start space-x-4 border-l-4 border-transparent hover:border-indigo-500"
          >
            <div className="p-3 bg-indigo-100 rounded-full group-hover:bg-indigo-200 transition-colors">
              <User className="w-6 h-6 text-indigo-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center justify-between">
                Field Inputer
                <ArrowRight className="w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-slate-500 text-sm">
                Submit demographic data for your assigned office or regional branch.
              </p>
            </div>
          </button>

          {/* Admin Card */}
          <button 
            onClick={() => onLogin(UserRole.ADMIN)}
            className="w-full group bg-white hover:bg-emerald-50 p-6 rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left flex items-start space-x-4 border-l-4 border-transparent hover:border-emerald-500"
          >
            <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
              <Shield className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-1 flex items-center justify-between">
                Administrator
                <ArrowRight className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-slate-500 text-sm">
                Access full database analytics, generate AI reports, and monitor compliance.
              </p>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};
