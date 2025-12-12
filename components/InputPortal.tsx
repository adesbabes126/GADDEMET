import React, { useState } from 'react';
import { Office, SubmissionRecord, Demographics, AgeGroup } from '../types';
import { OFFICES, EMPTY_DEMOGRAPHICS } from '../constants';
import { Building2, Save, RotateCcw, LogOut, CheckCircle2 } from 'lucide-react';

interface InputPortalProps {
  onLogout: () => void;
  onSubmit: (record: SubmissionRecord) => void;
}

export const InputPortal: React.FC<InputPortalProps> = ({ onLogout, onSubmit }) => {
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('');
  const [demographics, setDemographics] = useState<Demographics[]>(JSON.parse(JSON.stringify(EMPTY_DEMOGRAPHICS)));
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleDemographicChange = (index: number, field: 'male' | 'female', value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    const newDemographics = [...demographics];
    newDemographics[index] = { ...newDemographics[index], [field]: numValue };
    setDemographics(newDemographics);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfficeId) {
      alert("Please select an office first.");
      return;
    }

    const office = OFFICES.find(o => o.id === selectedOfficeId);
    if (!office) return;

    const newRecord: SubmissionRecord = {
      id: `rec_${Date.now()}`,
      officeId: office.id,
      officeName: office.name,
      timestamp: Date.now(),
      data: demographics,
    };

    onSubmit(newRecord);
    
    // Reset and show success
    setDemographics(JSON.parse(JSON.stringify(EMPTY_DEMOGRAPHICS)));
    setSuccessMsg("Data submitted successfully to central database.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const totalMale = demographics.reduce((acc, curr) => acc + curr.male, 0);
  const totalFemale = demographics.reduce((acc, curr) => acc + curr.female, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-800">Office Data Portal</h1>
          </div>
          <button onClick={onLogout} className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center space-x-1">
            <LogOut className="w-4 h-4" />
            <span>Switch Role</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center text-emerald-700 animate-pulse">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Contributing Office</label>
            <select 
              value={selectedOfficeId}
              onChange={(e) => setSelectedOfficeId(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            >
              <option value="">-- Choose Office --</option>
              {OFFICES.map(office => (
                <option key={office.id} value={office.id}>
                  {office.name} ({office.region})
                </option>
              ))}
            </select>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Demographic Data Entry</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="py-3 px-2 font-semibold text-slate-500 text-sm">Age Group</th>
                    <th className="py-3 px-2 font-semibold text-indigo-600 text-sm">Male Count</th>
                    <th className="py-3 px-2 font-semibold text-pink-600 text-sm">Female Count</th>
                    <th className="py-3 px-2 font-semibold text-slate-400 text-sm text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {demographics.map((row, index) => (
                    <tr key={row.ageGroup} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2">
                        <span className="font-medium text-slate-700 block">{row.ageGroup}</span>
                        <span className="text-xs text-slate-400">years old</span>
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          min="0"
                          value={row.male || ''}
                          placeholder="0"
                          onChange={(e) => handleDemographicChange(index, 'male', e.target.value)}
                          className="w-full max-w-[120px] p-2 border border-slate-200 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-mono text-slate-700 bg-white"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          min="0"
                          value={row.female || ''}
                          placeholder="0"
                          onChange={(e) => handleDemographicChange(index, 'female', e.target.value)}
                          className="w-full max-w-[120px] p-2 border border-slate-200 rounded-md focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none font-mono text-slate-700 bg-white"
                        />
                      </td>
                      <td className="py-3 px-2 text-right text-slate-400 font-mono">
                        {row.male + row.female}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-100 bg-slate-50">
                   <tr>
                    <td className="py-4 px-2 font-bold text-slate-800">Totals</td>
                    <td className="py-4 px-2 font-bold text-indigo-700">{totalMale}</td>
                    <td className="py-4 px-2 font-bold text-pink-700">{totalFemale}</td>
                    <td className="py-4 px-2 font-bold text-slate-800 text-right">{totalMale + totalFemale}</td>
                   </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => setDemographics(JSON.parse(JSON.stringify(EMPTY_DEMOGRAPHICS)))}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md shadow-indigo-200 flex items-center space-x-2 transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Submit to Database</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
