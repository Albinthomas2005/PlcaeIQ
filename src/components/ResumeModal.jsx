import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  Send
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { usePlacement } from '../context/PlacementContext';

export const ResumeModal = ({ student, isOpen, onClose, onSchedule = null, onOffer = null }) => {
  const { fireConfetti, showToast } = usePlacement();

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    fireConfetti();
    showToast(`Official ATS Resume downloaded for ${student.name}`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border-2 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto relative max-h-[92vh] flex flex-col">
        
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-wide text-white font-['Outfit']">
                  Verified Candidate ATS Dossier
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase">
                  Accredited
                </span>
              </div>
              <p className="text-xs text-slate-400">University Placement Directorate Verified Registry</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Print Resume"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable ATS Resume Sheet */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-7 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans print:p-0">
          
          {/* Header Banner */}
          <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-400 shadow-md shrink-0"
              />
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-['Outfit']">
                  {student.name}
                </h1>
                <p className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {student.headline || `${student.department} (${student.branchCode}) • Engineering Candidate`}
                </p>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  Roll No: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{student.rollNo}</span> • Class of {student.passingYear || 2026}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" />
                <a href={`mailto:${student.email}`} className="hover:underline">{student.email}</a>
              </span>
              {student.phone && (
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-500" />
                  <span>{student.phone}</span>
                </span>
              )}
              {student.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span>{student.location}</span>
                </span>
              )}
              <div className="flex items-center gap-3 pt-1">
                {student.github && (
                  <a href={student.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-800 dark:text-slate-200 hover:text-indigo-600 font-bold">
                    <GithubIcon className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
                {student.linkedin && (
                  <a href={student.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-800 dark:text-slate-200 hover:text-indigo-600 font-bold">
                    <LinkedinIcon className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Academic Profile */}
          <div className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white border-b-2 border-indigo-500/30 pb-1 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
              <span>Academic Credentials</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <p className="text-xs uppercase font-extrabold text-slate-400">B.Tech (Class of {student.passingYear || 2026})</p>
                <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">{student.department} ({student.branchCode})</h4>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Cumulative Score</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{student.cgpa} / 10.0 CGPA</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs font-medium text-slate-400">
                  <span>Backlogs: {student.backlogs}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {student.cgpa >= 8.5 ? 'First Class Distinction' : 'First Class Honors'}
                  </span>
                </div>
              </div>

              {student.education12th && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs uppercase font-extrabold text-slate-400">{student.education12th.title || 'Senior Secondary (Class XII)'}</p>
                  <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">{student.education12th.board}</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Aggregate Percentage</span>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{student.education12th.score}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 font-medium">{student.education12th.details}</p>
                </div>
              )}

              {student.education10th && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <p className="text-xs uppercase font-extrabold text-slate-400">{student.education10th.title || 'Secondary School (Class X)'}</p>
                  <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">{student.education10th.board}</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Cumulative GPA</span>
                    <span className="text-base font-black text-indigo-600 dark:text-indigo-400">{student.education10th.score}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 font-medium">{student.education10th.details}</p>
                </div>
              )}
            </div>
          </div>

          {/* Technical Skills Matrix */}
          <div className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white border-b-2 border-indigo-500/30 pb-1 flex items-center gap-2">
              <Code className="w-5 h-5 text-indigo-500" />
              <span>Core Technical Competencies</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {student.skills && student.skills.length > 0 ? (
                student.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-black shadow-xs"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-400 italic">No technical skills recorded</span>
              )}
            </div>
          </div>

          {/* Industry Work & Project Experience */}
          <div className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white border-b-2 border-indigo-500/30 pb-1 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              <span>Featured Engineering Projects & Experience</span>
            </h2>
            
            {student.projects && student.projects.length > 0 ? (
              <div className="space-y-4 text-sm">
                {student.projects.map((proj, pIdx) => (
                  <div key={pIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-base font-black text-slate-900 dark:text-white">
                        {proj.title}
                      </h4>
                      {proj.tech && (
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{proj.tech}</span>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-sm text-slate-500 font-medium">
                Verified practical coursework and academic laboratory engineering projects on record with placement cell.
              </div>
            )}
          </div>

          {/* Honors & Certifications */}
          <div className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white border-b-2 border-indigo-500/30 pb-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" />
              <span>Honors, Certifications & Achievements</span>
            </h2>
            {student.certifications && student.certifications.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {student.certifications.map((cert, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{typeof cert === 'string' ? cert : cert.name || cert.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-sm text-slate-500 font-medium">
                Candidate registered in good standing under University Placement Directorate Verification Code 2026.
              </div>
            )}
          </div>

          {/* Directorate Official Endorsement */}
          <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-emerald-500 shrink-0" />
              <div>
                <p className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">
                  Official Verification & Directorate Authorization
                </p>
                <p className="text-slate-500">
                  Certified genuine candidate records verified under University Placement Directorate Rules 2026.
                </p>
              </div>
            </div>
            <div className="text-right text-slate-400 font-mono text-xs font-semibold">
              UID: CAND-{student.id}-{student.rollNo}
            </div>
          </div>

        </div>

        {/* Bottom Interactive Recruiter Action Strip */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Current Cohort Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black ${
              student.status === 'Placed' 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
            }`}>
              {student.status} {student.placedCompany ? `@ ${student.placedCompany} (${student.placedPackage})` : ''}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {onSchedule && (
              <button
                onClick={() => {
                  onSchedule(student);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Round</span>
              </button>
            )}
            {onOffer && student.status !== 'Placed' && (
              <button
                onClick={() => {
                  onOffer(student);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <Award className="w-4 h-4" />
                <span>Extend Offer</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done Viewing
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
