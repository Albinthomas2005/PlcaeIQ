import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart, ExternalLink, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-14 border-t-2 border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
      <div className="w-full max-w-[96%] xl:max-w-[1640px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6c5ce7] to-[#a29bfe] flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">PlaceIQ</span>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Centralized campus placement and recruitment ecosystem connecting students, corporate talent partners, and the university placement directorate.
            </p>
            <div className="flex items-center gap-2 text-sm sm:text-base text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
              <span>NAAC A++ Accredited Institution</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <p className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">Quick Portals</p>
            <ul className="space-y-2 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300">
              <li><Link to="/officer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Placement Directorate (Admin)</Link></li>
              <li><Link to="/student" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Student Profile & Resume</Link></li>
              <li><Link to="/company" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Recruiter Talent Hub</Link></li>
              <li><Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Active Campus Drives</Link></li>
              <li><Link to="/results" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Placement Hall of Fame</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <p className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">Recruitment Cell</p>
            <div className="space-y-1.5 text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">
              <p className="font-bold text-slate-900 dark:text-white">Placement & Training Directorate</p>
              <p>Central Academic Block, Level 3</p>
              <p>Email: placements@university.edu</p>
              <p>Helpline: +91 (080) 4567-8900</p>
              <p className="pt-1 text-xs sm:text-sm text-slate-500 font-semibold">Office Hours: Mon - Fri, 9:00 AM - 5:30 PM</p>
            </div>
          </div>

          {/* Col 4 */}
          <div className="space-y-3">
            <p className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">2025 - 2026 Season Stats</p>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-sm sm:text-base font-bold">
              <div className="flex justify-between">
                <span className="text-slate-500">Highest Package</span>
                <span className="font-black text-slate-900 dark:text-white">₹48.0 LPA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Average CTC</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">₹18.4 LPA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Placement %</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">94.8%</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm sm:text-base text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} PlaceIQ Centralized Placement Directorate. All rights reserved.</p>
          <div className="flex items-center gap-1.5 font-bold">
            <span>Built for institutional excellence & recruitment governance</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};
