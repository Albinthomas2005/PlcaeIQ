import React, { useState } from 'react';
import { Briefcase, X, DollarSign, Calendar, Users, CheckCircle, FileText } from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';

export const NewJobModal = ({ isOpen, onClose, defaultCompany = null }) => {
  const { companies, addJob, showToast } = usePlacement();

  const [companyId, setCompanyId] = useState(defaultCompany?.id || companies[0]?.id || '');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('Full Stack / SDE');
  const [location, setLocation] = useState('Bengaluru / Hybrid');
  const [packageCtc, setPackageCtc] = useState('18.5');
  const [minCgpa, setMinCgpa] = useState('7.5');
  const [maxBacklogs, setMaxBacklogs] = useState('0');
  const [branches, setBranches] = useState(['CSE', 'IT']);
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [vacancies, setVacancies] = useState('10');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleBranchToggle = (b) => {
    if (branches.includes(b)) {
      if (branches.length > 1) {
        setBranches(branches.filter(item => item !== b));
      }
    } else {
      setBranches([...branches, b]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const comp = companies.find(c => c.id === companyId) || defaultCompany || companies[0];

    if (!title) {
      showToast('Please enter a job title.', 'error');
      return;
    }

    const ctcVal = parseFloat(packageCtc) || 12.0;

    addJob({
      companyId: comp.id,
      companyName: comp.name,
      title,
      type: 'Full-time',
      role,
      location,
      packageCtc: ctcVal,
      packageDisplay: `₹${ctcVal} LPA`,
      stipend: `₹${Math.round(ctcVal * 3500)} / month`,
      minCgpa: parseFloat(minCgpa) || 7.0,
      allowedBranches: branches,
      maxBacklogs: parseInt(maxBacklogs, 10) || 0,
      deadline,
      vacancies: parseInt(vacancies, 10) || 10,
      description: description || `Exciting engineering and technical opportunities at ${comp.name}.`,
      rounds: ['Online Assessment', 'Technical Round 1', 'Director/HR Discussion']
    });

    onClose();
  };

  const ALL_BRANCHES = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'EEE', 'All'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border-2 border-indigo-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        <div className="p-7 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">Announce Campus Drive</h3>
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 border border-indigo-300">
                  Campus Recruitment
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Post new job opening with eligibility criteria</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5 text-sm sm:text-base">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Recruiting Enterprise</label>
              {defaultCompany ? (
                <input
                  type="text"
                  readOnly
                  value={defaultCompany.name}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm sm:text-base"
                />
              ) : (
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm sm:text-base"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Position / Role Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Associate Cloud Engineer"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Package CTC (in LPA)</label>
              <input
                type="number"
                step="0.5"
                min="3"
                max="100"
                value={packageCtc}
                onChange={(e) => setPackageCtc(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Min CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Max Backlogs Allowed</label>
              <input
                type="number"
                min="0"
                max="5"
                value={maxBacklogs}
                onChange={(e) => setMaxBacklogs(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm sm:text-base"
                required
              />
            </div>
          </div>

          {/* Allowed branches selector */}
          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-2">Eligible Engineering Branches</label>
            <div className="flex flex-wrap gap-2">
              {ALL_BRANCHES.map(br => {
                const isSelected = branches.includes(br);
                return (
                  <button
                    key={br}
                    type="button"
                    onClick={() => handleBranchToggle(br)}
                    className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#6c5ce7] text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {br} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Application Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Target Vacancies</label>
              <input
                type="number"
                value={vacancies}
                onChange={(e) => setVacancies(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm sm:text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Job Description & Responsibilities</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key skills, role overview, technical domain and expectations..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm sm:text-base cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white font-black text-sm sm:text-base shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Publish Job Drive
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
