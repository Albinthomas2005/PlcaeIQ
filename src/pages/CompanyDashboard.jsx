import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  Users, 
  Award, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileText
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';
import { ApplicationStatusBadge } from '../components/ApplicationStatusBadge';
import { NewJobModal } from '../components/NewJobModal';
import { ScheduleInterviewModal } from '../components/ScheduleInterviewModal';
import { OfferLetterModal } from '../components/OfferLetterModal';
import { ResumeModal } from '../components/ResumeModal';

export const CompanyDashboard = () => {
  const { 
    currentCompany, 
    companies, 
    setActiveCompanyId, 
    students,
    jobs, 
    applications, 
    updateApplicationStatus, 
    deleteJob,
    showToast,
    fireConfetti,
    setCurrentRole
  } = usePlacement();

  const [activeTab, setActiveTab] = useState('applicants'); // 'applicants' | 'listings' | 'profile'
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedOfferApp, setSelectedOfferApp] = useState(null);
  const [inspectStudent, setInspectStudent] = useState(null);

  // Filters
  const [applicantSearch, setApplicantSearch] = useState('');
  const [jobFilter, setJobFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  if (!currentCompany) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-slate-500 font-bold">Connecting to corporate recruiter portal via database...</p>
        </div>
      </div>
    );
  }

  // Company specific jobs and applicants
  const companyJobs = jobs.filter(j => j.companyId === currentCompany.id || j.companyName === currentCompany.name);
  const companyJobIds = companyJobs.map(j => j.id);
  const companyApplicants = applications.filter(a => 
    a.companyId === currentCompany.id || 
    a.companyName === currentCompany.name || 
    companyJobIds.includes(a.jobId)
  );

  // Filtered applicants
  const filteredApplicants = companyApplicants.filter(a => {
    const matchesSearch = a.studentName.toLowerCase().includes(applicantSearch.toLowerCase()) ||
                          a.studentRoll.toLowerCase().includes(applicantSearch.toLowerCase()) ||
                          a.studentBranch.toLowerCase().includes(applicantSearch.toLowerCase());
    const matchesJob = jobFilter === 'All' || a.jobId === jobFilter || a.jobTitle === jobFilter;
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesJob && matchesStatus;
  });

  return (
    <div className="w-full px-3 sm:px-8 py-6 space-y-6 animate-fade-in">
      
      {/* Recruiter Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white p-2.5 shadow-xl flex items-center justify-center shrink-0">
              <Building2 className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-['Outfit'] text-white">
                  {currentCompany.name}
                </h1>
                <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-black border border-emerald-500/30">
                  {currentCompany.tier}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-300 mt-1 font-semibold">
                {currentCompany.industry} • {currentCompany.location}
              </p>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">HR Lead: {currentCompany.hrContact}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setJobModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-base font-black shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Post Campus Job</span>
            </button>
            <button
              onClick={() => setInterviewModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base font-bold border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
              <span>Schedule Interview</span>
            </button>
          </div>
        </div>

        {/* Quick Switcher for Recruiter Company */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-400 font-bold mr-1">Switch Recruiting Partner:</span>
          {companies.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCompanyId(c.id)}
              className={`px-3.5 py-1.5 rounded-full transition-all text-xs sm:text-sm font-semibold ${
                currentCompany.id === c.id
                  ? 'bg-emerald-600 text-white font-black shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Tab Controls */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'applicants', label: `Candidate Pipeline (${companyApplicants.length})`, icon: Users },
            { id: 'listings', label: `Active Openings (${companyJobs.length})`, icon: Briefcase },
            { id: 'profile', label: 'Company Profile & Info', icon: Building2 },
          ].map(tab => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-base font-black whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-white text-slate-900 shadow-md scale-105'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* TAB 1: APPLICANTS PIPELINE */}
      {activeTab === 'applicants' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[280px]">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={applicantSearch}
                  onChange={(e) => setApplicantSearch(e.target.value)}
                  placeholder="Filter candidate name, roll, branch..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm sm:text-base font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-2xl text-sm sm:text-base font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="All">All Application Stages</option>
                <option value="Applied">1. Applied</option>
                <option value="Screened">2. Profile Screened</option>
                <option value="Interview">3. Interview Scheduled</option>
                <option value="Offered">4. Offer Extended</option>
              </select>
            </div>

            <div className="text-sm font-bold text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{filteredApplicants.length}</strong> Candidate Applications
            </div>
          </div>

          {/* Applicants Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {filteredApplicants.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-lg font-black text-slate-700 dark:text-slate-300">No applicants found matching filter</p>
                <p className="text-sm mt-1">Select a different recruiting company or filter criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm sm:text-base">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase tracking-wider font-black border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Candidate Profile</th>
                      <th className="p-4">Applied Opening</th>
                      <th className="p-4">Academic CGPA</th>
                      <th className="p-4">Current Stage</th>
                      <th className="p-4 text-right">Recruiter Workflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    {filteredApplicants.map(applicant => (
                      <tr key={applicant.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <div className="font-black text-slate-900 dark:text-white text-base sm:text-lg">{applicant.studentName}</div>
                          <div className="text-xs sm:text-sm text-slate-400 font-semibold">{applicant.studentRoll}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white text-base">{applicant.jobTitle}</div>
                          <div className="text-xs sm:text-sm text-slate-400 font-medium">{applicant.appliedDate}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-black text-emerald-600 dark:text-emerald-400 text-base sm:text-lg">{applicant.studentCgpa} CGPA</div>
                          <div className="text-xs sm:text-sm text-slate-400 font-bold">{applicant.studentBranch}</div>
                        </td>
                        <td className="p-4">
                          <ApplicationStatusBadge status={applicant.status} />
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              const st = students.find(s => s.id === applicant.studentId) || {
                                id: applicant.studentId,
                                name: applicant.studentName,
                                rollNo: applicant.studentRoll,
                                branchCode: applicant.studentBranch,
                                department: applicant.studentBranch || 'Engineering',
                                cgpa: applicant.studentCgpa || 0,
                                backlogs: 0,
                                skills: [],
                                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                                email: `${applicant.studentRoll?.toLowerCase() || 'student'}@campus.edu`
                              };
                              setInspectStudent(st);
                            }}
                            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="w-4 h-4 text-indigo-500" />
                            <span>Resume</span>
                          </button>

                          <button
                            onClick={() => updateApplicationStatus(applicant.id, 'Screened')}
                            className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs sm:text-sm font-black shadow-xs cursor-pointer"
                          >
                            Shortlist
                          </button>

                          <button
                            onClick={() => setInterviewModalOpen(true)}
                            className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-300 text-xs sm:text-sm font-black shadow-xs cursor-pointer"
                          >
                            Interview
                          </button>

                          <button
                            onClick={() => {
                              updateApplicationStatus(applicant.id, 'Offered', currentCompany.avgPackage || '₹24.0 LPA');
                              fireConfetti();
                              showToast(`Formal offer extended to ${applicant.studentName}!`, 'success');
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black shadow-md shadow-emerald-500/25 cursor-pointer"
                          >
                            Extend Offer 🎉
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: ACTIVE OPENINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                Campus Job Drives Hosted by {currentCompany.name} ({companyJobs.length})
              </h3>
              <p className="text-sm sm:text-base text-slate-400 font-medium">Vacancies, application deadlines, and eligibility criteria</p>
            </div>
            
            <button
              onClick={() => setJobModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm sm:text-base font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>+ Create New Listing</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companyJobs.map(job => (
              <div 
                key={job.id}
                className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between hover:border-indigo-400 hover:shadow-xl transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">{job.title}</h4>
                      <p className="text-sm font-semibold text-slate-400">{job.role} • {job.location}</p>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{job.packageDisplay}</span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed font-medium">
                    {job.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Min CGPA</span>
                    <span className="font-black text-slate-900 dark:text-white text-base sm:text-lg">{job.minCgpa}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Max Backlogs</span>
                    <span className="font-black text-slate-900 dark:text-white text-base sm:text-lg">{job.maxBacklogs}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs font-bold block uppercase tracking-wider">Branches</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 truncate block text-sm sm:text-base">{job.allowedBranches.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-sm font-semibold">
                  <span className="text-slate-400">Deadline: <strong className="text-slate-800 dark:text-slate-200">{job.deadline}</strong></span>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="text-rose-600 hover:text-rose-700 hover:underline font-bold text-sm px-3 py-1 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    Archive Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COMPANY PROFILE */}
      {activeTab === 'profile' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-4xl mx-auto animate-fade-in">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">Recruiting Organization Profile</h3>
            <p className="text-sm text-slate-400 mt-1">Corporate accreditation, university talent partnership credentials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Company Name</span>
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{currentCompany.name}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Accredited Tier</span>
              <p className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">{currentCompany.tier}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recruitment Contact</span>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{currentCompany.hrContact}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Recruiter Email</span>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{currentCompany.email}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Corporate Careers URL</span>
              <a href={currentCompany.website} target="_blank" rel="noreferrer" className="text-base font-bold text-indigo-600 hover:underline flex items-center gap-1.5">
                <span>{currentCompany.website}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Office / Campus Hub</span>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{currentCompany.location}</p>
            </div>
          </div>

          <div className="space-y-3 pt-5 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider">Company Description</span>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base font-medium">
              {currentCompany.description}
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewJobModal isOpen={jobModalOpen} onClose={() => setJobModalOpen(false)} defaultCompany={currentCompany} />
      <ScheduleInterviewModal isOpen={interviewModalOpen} onClose={() => setInterviewModalOpen(false)} />
      <OfferLetterModal application={selectedOfferApp} onClose={() => setSelectedOfferApp(null)} />
      <ResumeModal
        student={inspectStudent}
        isOpen={!!inspectStudent}
        onClose={() => setInspectStudent(null)}
        onSchedule={() => setInterviewModalOpen(true)}
      />

    </div>
  );
};
