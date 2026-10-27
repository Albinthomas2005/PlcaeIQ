import React from 'react';
import { Clock, CheckCircle2, Award, XCircle, Users } from 'lucide-react';

export const ApplicationStatusBadge = ({ status }) => {
  switch (status) {
    case 'Offered':
      return (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-sm animate-pulse">
          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Offer Extended 🎉</span>
        </span>
      );
    case 'Interview':
      return (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Interview Scheduled</span>
        </span>
      );
    case 'Screened':
      return (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
          <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Profile Shortlisted</span>
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>Not Selected</span>
        </span>
      );
    case 'Applied':
    default:
      return (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Application Submitted</span>
        </span>
      );
  }
};
