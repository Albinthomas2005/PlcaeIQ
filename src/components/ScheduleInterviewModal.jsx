import React, { useState } from 'react';
import { Calendar, Clock, Link as LinkIcon, User, Building, X, Video, Send } from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';

export const ScheduleInterviewModal = ({ isOpen, onClose, preselectedStudent = null, preselectedJob = null }) => {
  const { students, jobs, scheduleInterview, showToast } = usePlacement();

  const [studentId, setStudentId] = useState(preselectedStudent?.id || (students[0]?.id || ''));
  const [jobId, setJobId] = useState(preselectedJob?.id || (jobs[0]?.id || ''));
  const [roundName, setRoundName] = useState('Technical Interview Round 1');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('11:00 AM - 12:00 PM');
  const [venueOrLink, setVenueOrLink] = useState('https://meet.google.com/campus-interview-live');
  const [interviewer, setInterviewer] = useState('University Technical Panel / HR');
  const [instructions, setInstructions] = useState('Keep webcam on, resume handy, and prepare an overview of system design projects.');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const student = students.find(s => s.id === studentId);
    const job = jobs.find(j => j.id === jobId);

    if (!student || !job) {
      showToast('Please select a valid student and job drive.', 'error');
      return;
    }

    scheduleInterview({
      jobId: job.id,
      studentId: student.id,
      studentName: student.name,
      studentRoll: student.rollNo,
      companyName: job.companyName,
      roundName,
      date,
      time,
      venueOrLink,
      interviewer,
      instructions
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border-2 border-indigo-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-7 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">Schedule Interview Round</h3>
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 border border-indigo-300">
                  Round Coordination
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Coordinate drive assessment or HR evaluation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-7 space-y-5 text-sm sm:text-base">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Select Candidate</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm sm:text-base"
                required
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.branchCode} - CGPA {s.cgpa})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Campus Drive / Job</label>
              <select
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm sm:text-base"
                required
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.companyName} - {j.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Round Title</label>
            <input
              type="text"
              value={roundName}
              onChange={(e) => setRoundName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              placeholder="e.g. Technical Round 1 (DSA & Live Coding)"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Interview Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Time Window</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                placeholder="10:00 AM - 11:30 AM"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Meeting Link or Campus Room</label>
            <div className="relative">
              <input
                type="text"
                value={venueOrLink}
                onChange={(e) => setVenueOrLink(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                placeholder="Google Meet / MS Teams / Placement Block Room 204"
                required
              />
              <Video className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Lead Interviewer / Panelist</label>
            <input
              type="text"
              value={interviewer}
              onChange={(e) => setInterviewer(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              placeholder="e.g. Senior Software Architect / HR Director"
            />
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Preparation Instructions for Candidate</label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
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
              className="px-8 py-3 rounded-2xl bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white font-black text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Confirm & Dispatch Notice</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
