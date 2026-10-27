import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  FileText,
  ShieldCheck,
  Star
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';
import { OfferLetterModal } from '../components/OfferLetterModal';

export const ResultsPage = () => {
  const { students, applications, fireConfetti } = usePlacement();
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  // Placed students
  const placedList = students.filter(s => s.status === 'Placed');
  const offeredApps = applications.filter(a => a.status === 'Offered');

  const filteredPlaced = placedList.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
    (s.placedCompany && s.placedCompany.toLowerCase().includes(search.toLowerCase())) ||
    s.branchCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full px-3 sm:px-8 py-6 space-y-6 animate-fade-in">
      
      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-800 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-sm sm:text-base font-black border border-amber-500/40">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Official University Placement Hall of Fame</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight font-['Outfit']">
            Placement Results & Achievements
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-medium">
            Celebrating the academic rigor, technical excellence, and corporate offers secured by the graduating cohort of 2026.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={fireConfetti}
              className="px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base tracking-wider uppercase transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>Celebrate Cohort 🎉</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Highest Packages Spotlight Cards */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Outfit'] mb-6 flex items-center gap-3">
          <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
          <span>Star Recruits & Dream Tier Placement Offers</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {placedList.slice(0, 3).map((student, idx) => (
            <div 
              key={student.id}
              className="p-7 rounded-3xl bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-300/80 dark:border-amber-900/50 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-200">
                  Rank #{idx + 1} Offer
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-['Outfit']">
                  {student.placedPackage}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                />
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{student.name}</h4>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{student.branchCode} • CGPA {student.cgpa}</p>
                  <p className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    Placed at {student.placedCompany}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
                <span className="text-slate-500 font-bold">Roll: {student.rollNo}</span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Offer</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Placed Registry Table with Search */}
      <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
              Complete Placement Roster ({placedList.length} Selected Candidates)
            </h3>
            <p className="text-sm sm:text-base font-semibold text-slate-500">Official registry authorized by University Placement Directorate</p>
          </div>

          <div className="relative min-w-[280px]">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate, company, branch..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm sm:text-base font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs sm:text-sm font-black border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Candidate</th>
                <th className="p-4">Department</th>
                <th className="p-4">Hiring Company</th>
                <th className="p-4">Compensation CTC</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Offer Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredPlaced.map(student => {
                const matchApp = offeredApps.find(a => a.studentId === student.id) || {
                  id: `off-${student.id}`,
                  studentName: student.name,
                  studentRoll: student.rollNo,
                  studentBranch: student.branchCode,
                  companyName: student.placedCompany || 'Campus Recruiter',
                  jobTitle: `${student.branchCode} Specialist`,
                  offeredPackage: student.placedPackage || 'Campus Offer'
                };

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="p-4">
                      <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{student.name}</div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-500">{student.rollNo}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{student.branchCode}</span>
                      <div className="text-xs sm:text-sm font-semibold text-slate-500">CGPA: {student.cgpa}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-500" />
                        <span>{student.placedCompany}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                        {student.placedPackage}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Directorate Approved</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          fireConfetti();
                          setSelectedApp(matchApp);
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black transition-all shadow hover:shadow-md cursor-pointer"
                      >
                        Inspect Offer Letter
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Offer Letter Modal */}
      <OfferLetterModal application={selectedApp} onClose={() => setSelectedApp(null)} />

    </div>
  );
};
