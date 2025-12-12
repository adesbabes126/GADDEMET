import React, { useState, useMemo } from 'react';
import { SubmissionRecord, AgeGroup } from '../types';
import { analyzeGenderData } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import { 
  LayoutDashboard, LogOut, RefreshCcw, Sparkles, Users, 
  ArrowUpRight, ArrowDownRight, Activity 
} from 'lucide-react';

interface AdminDashboardProps {
  records: SubmissionRecord[];
  onLogout: () => void;
}

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ records, onLogout }) => {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- Data Aggregation Logic ---
  const aggregatedStats = useMemo(() => {
    let totalMale = 0;
    let totalFemale = 0;
    const ageDistribution: Record<string, { male: number; female: number }> = {};
    const officeDistribution: Record<string, number> = {};

    records.forEach(rec => {
      // Office stats
      const totalRecPop = rec.data.reduce((acc, d) => acc + d.male + d.female, 0);
      officeDistribution[rec.officeName] = (officeDistribution[rec.officeName] || 0) + totalRecPop;

      // Age & Total stats
      rec.data.forEach(d => {
        totalMale += d.male;
        totalFemale += d.female;
        
        if (!ageDistribution[d.ageGroup]) {
          ageDistribution[d.ageGroup] = { male: 0, female: 0 };
        }
        ageDistribution[d.ageGroup].male += d.male;
        ageDistribution[d.ageGroup].female += d.female;
      });
    });

    const ageChartData = Object.keys(ageDistribution).map(key => ({
      name: key,
      Male: ageDistribution[key].male,
      Female: ageDistribution[key].female,
    }));

    const officeChartData = Object.keys(officeDistribution).map(key => ({
      name: key,
      value: officeDistribution[key],
    }));

    return { totalMale, totalFemale, ageChartData, officeChartData };
  }, [records]);

  const totalPopulation = aggregatedStats.totalMale + aggregatedStats.totalFemale;
  const femalePercentage = totalPopulation > 0 ? ((aggregatedStats.totalFemale / totalPopulation) * 100).toFixed(1) : 0;

  const handleAIAnalysis = async () => {
    if (records.length === 0) return;
    setIsAnalyzing(true);
    setAiReport(null);
    const result = await analyzeGenderData(records);
    setAiReport(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Admin Analytics Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-slate-500 font-mono px-3 py-1 bg-slate-100 rounded-full">
            DB Records: {records.length}
          </div>
          <button 
            onClick={onLogout}
            className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Population</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalPopulation.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
               <div className="h-full bg-blue-500" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Gender Ratio (F)</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{femalePercentage}%</h3>
              </div>
              <div className="p-2 bg-pink-50 rounded-lg">
                <Activity className="w-6 h-6 text-pink-600" />
              </div>
            </div>
            <div className="flex items-center text-xs text-slate-500 mt-2">
              <span className="text-indigo-600 font-bold mr-2">{aggregatedStats.totalMale.toLocaleString()} Male</span>
              <span className="text-pink-600 font-bold">{aggregatedStats.totalFemale.toLocaleString()} Female</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center items-start">
             <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-slate-700">AI Insights</span>
             </div>
             <p className="text-sm text-slate-500 mb-4">
               Generate a strategic report on gender gaps and development needs based on current data.
             </p>
             <button 
               onClick={handleAIAnalysis}
               disabled={isAnalyzing || records.length === 0}
               className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             >
               {isAnalyzing ? "Analyzing Data..." : "Generate Analysis"}
             </button>
          </div>
        </div>

        {/* AI Report Section */}
        {aiReport && (
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center justify-between">
              <h3 className="font-bold text-purple-800 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Gemini Analysis Report
              </h3>
              <button onClick={() => setAiReport(null)} className="text-xs text-purple-600 hover:underline">Close</button>
            </div>
            <div className="p-8 prose prose-indigo max-w-none text-slate-700">
              <ReactMarkdown>{aiReport}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Age Group Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-6">Demographics by Age Group</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aggregatedStats.ageChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <RechartsTooltip 
                    cursor={{fill: '#f1f5f9'}} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Legend />
                  <Bar dataKey="Male" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="Female" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Office Contribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-6">Population Distribution by Office</h3>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={aggregatedStats.officeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {aggregatedStats.officeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
