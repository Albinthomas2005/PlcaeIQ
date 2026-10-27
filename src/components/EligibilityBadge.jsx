import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';

export const EligibilityBadge = ({ job, student, showDetails = false }) => {
  const { checkEligibility } = usePlacement();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const evalResult = checkEligibility(student, job);
  const { meetsRequirements = false, cgpaOk = true, backlogsOk = true, branchOk = true, reasons = [] } = evalResult;

  return (
    <div className="relative inline-flex items-center">
      <div 
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-black cursor-pointer transition-all duration-200 shadow-xs ${
          meetsRequirements 
            ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/50' 
            : 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/50'
        }`}
        onClick={() => setTooltipVisible(!tooltipVisible)}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        {meetsRequirements ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Eligible ({student?.cgpa ?? '0'} CGPA)</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Below Cutoff (Req: {job.minCgpa} CGPA)</span>
          </>
        )}
      </div>

      {/* Tooltip Details */}
      {tooltipVisible && (
        <div className="absolute bottom-full left-0 sm:left-auto sm:right-0 mb-2 w-80 p-4 bg-slate-900 text-white rounded-2xl shadow-2xl z-50 pointer-events-none animate-fade-in border border-slate-700 text-xs sm:text-sm">
          <div className="font-bold pb-2 mb-2 border-b border-slate-700 flex items-center justify-between">
            <span>Eligibility Breakdown</span>
            <span className={meetsRequirements ? 'text-emerald-400' : 'text-amber-400'}>
              {meetsRequirements ? '✓ Qualified for Drive' : '⚠ Cutoff Gap'}
            </span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Min CGPA: {job.minCgpa}</span>
              <span className={cgpaOk ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                You: {student?.cgpa ?? 'N/A'} {cgpaOk ? '✓' : `✗ (< ${job.minCgpa})`}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Branches: {job.allowedBranches.join(', ')}</span>
              <span className={branchOk ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                You: {student?.branchCode ?? 'N/A'} {branchOk ? '✓' : '✗'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Max Backlogs: {job.maxBacklogs}</span>
              <span className={backlogsOk ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                You: {student?.backlogs ?? 0} {backlogsOk ? '✓' : `✗ (${student?.backlogs} active)`}
              </span>
            </div>
          </div>

          {!meetsRequirements && reasons.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-800 text-xs text-amber-300 font-medium">
              Note: {reasons[0]}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

