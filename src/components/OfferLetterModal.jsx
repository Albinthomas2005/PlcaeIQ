import React from 'react';
import { Award, CheckCircle2, Download, Printer, X, ShieldCheck, Sparkles, Building2, Calendar, FileText } from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';

export const OfferLetterModal = ({ application, onClose }) => {
  const { fireConfetti, showToast } = usePlacement();

  if (!application) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border-2 border-emerald-300 dark:border-emerald-900 shadow-2xl overflow-hidden relative">
        
        {/* Header bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-7 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md shadow-md">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm uppercase tracking-widest font-black text-emerald-100">Formal Campus Placement</span>
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">Letter of Intent & Offer Extended</h2>
            </div>
          </div>
        </div>

        {/* Content body formatted as official document */}
        <div className="p-7 md:p-9 space-y-6 text-slate-800 dark:text-slate-200">
          
          <div className="flex items-start justify-between border-b-2 border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-wider text-slate-400 font-bold">Candidate</p>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">{application.studentName}</h3>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">Roll No: {application.studentRoll} • {application.studentBranch}</p>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm uppercase tracking-wider text-slate-400 font-bold">Issuing Company</p>
              <h3 className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{application.companyName}</h3>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">Campus Recruitment Drive 2026</p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">Designation & Role</p>
              <p className="text-lg sm:text-xl font-black text-emerald-950 dark:text-emerald-200 mt-0.5">{application.jobTitle}</p>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">Offered Package (CTC)</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-300 mt-0.5">{application.offeredPackage || '₹24.0 LPA'}</p>
            </div>
          </div>

          <p className="text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
            We are pleased to inform you that subsequent to the written evaluations, technical rounds, and leadership discussions conducted during the campus recruitment process, you have been selected for employment with <strong>{application.companyName}</strong>. 
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-wider">Commencement Date</p>
              <p className="font-black text-slate-900 dark:text-white mt-1">July 2026 (Post Final Semester)</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 font-bold text-xs sm:text-sm uppercase tracking-wider">Reporting Location</p>
              <p className="font-black text-slate-900 dark:text-white mt-1">Global Tech Center / Hybrid</p>
            </div>
          </div>

          {/* Verification stamp */}
          <div className="pt-5 border-t-2 border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm sm:text-base text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Accredited & Verified by University Placement Cell</span>
            </div>
            <div className="text-right text-xs sm:text-sm font-mono text-slate-400 font-semibold">
              Reference: PMS-OFFER-{application.id}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-7 py-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              fireConfetti();
              showToast(`Official Offer Letter downloaded for ${application.studentName}!`, 'success');
            }}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm sm:text-base font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={() => {
              fireConfetti();
              onClose();
            }}
            className="flex items-center gap-2.5 px-8 py-3 rounded-2xl text-sm sm:text-base font-black bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Accept & Celebrate 🎉</span>
          </button>
        </div>

      </div>
    </div>
  );
};
