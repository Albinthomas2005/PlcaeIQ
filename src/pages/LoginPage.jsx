import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  GraduationCap, 
  UserCheck, 
  Building2, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Zap,
  Award,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, authSession, logout, students } = usePlacement();

  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'officer' | 'company'
  const [identifier, setIdentifier] = useState('1'); // Default to Student 1
  const [password, setPassword] = useState('1');     // Default to Password 1
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tabs = [
    { id: 'student', label: 'Student Portal',     Icon: GraduationCap, defaultId: '1',                  defaultPass: '1'        },
    { id: 'officer', label: 'Admin / TPO Hub',    Icon: UserCheck,     defaultId: 'admin@placement.edu', defaultPass: 'admin123' },
    { id: 'company', label: 'Recruiter Hub',      Icon: Building2,     defaultId: 'campus-hiring@google.com', defaultPass: 'hiring123' },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab.id);
    setIdentifier(tab.defaultId);
    setPassword(tab.defaultPass);
    setError('');
  };

  const executeLogin = async (idToUse, passToUse) => {
    const finalId = idToUse !== undefined ? idToUse : identifier;
    const finalPass = passToUse !== undefined ? passToUse : password;
    setError('');
    setLoading(true);
    try {
      const res = await login(finalId, finalPass, activeTab);
      setLoading(false);
      if (res && res.success) {
        navigate(res.path);
      } else {
        setError(res?.message || 'No record found. Please enter a valid Login ID & Password.');
      }
    } catch {
      setLoading(false);
      setError('Unable to authenticate with database backend.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLogin(identifier, password);
  };

  const handleShortcutLogin = (numStr) => {
    setIdentifier(numStr);
    setPassword(numStr);
    executeLogin(numStr, numStr);
  };

  // Dynamically map first 3 students from the database for shortcut login cards
  const studentDemoCards = students.slice(0, 3).map((s, idx) => ({
    num: s.rollNo || String(idx + 1),
    student: s,
    name: s.name,
    roll: s.rollNo,
    branch: s.branchCode,
    cgpa: s.cgpa,
    status: s.status,
    statusClass: s.status === 'Placed'
      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-400/30'
      : 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-400/30',
    highlights: s.placedCompany
      ? `Placed at ${s.placedCompany} • ${s.placedPackage}`
      : (s.skills && s.skills.length > 0 ? s.skills.slice(0, 3).join(', ') : 'Seeking Placements'),
    avatar: s.avatar
  }));

  return (
    <div
      style={{ minHeight: 'calc(100vh - 80px)' }}
      className="w-full flex flex-col items-center justify-center px-4 sm:px-8 py-10 relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-white to-sky-50/40 dark:from-[#0a0c13] dark:via-[#0f111c] dark:to-[#141526] pointer-events-none" />
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Wide Stretched Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-6">

        {/* Security / Portal Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-black uppercase tracking-wider shadow-sm">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>PlaceIQ Centralized Campus Recruitment Portal • Live Authentication</span>
        </div>

        {/* Big Stretched Card */}
        <div className="w-full p-6 sm:p-10 md:p-12 rounded-[36px] bg-white/95 dark:bg-[#121422]/95 backdrop-blur-xl border-2 border-indigo-100 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(99,102,241,0.2)]">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white font-['Outfit'] tracking-tight">
              Portal Sign In
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Access your personalized student placement portal, verify eligibility for campus drives, and review interview schedules
            </p>
          </div>

          {/* Role selector tabs - Stretched */}
          <div className="mt-8 grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 max-w-xl mx-auto">
            {tabs.map((tab) => {
              const Icon = tab.Icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-md scale-102'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Currently Signed-in Active Banner */}
          {authSession?.isLoggedIn && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-emerald-950 dark:text-emerald-200">
                  Currently signed in as: <strong className="font-black text-emerald-700 dark:text-emerald-300">{authSession.user?.name}</strong> ({authSession.role})
                  {authSession.user?.cgpa && ` • CGPA: ${authSession.user?.cgpa}`}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-4 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-600 font-bold hover:bg-rose-50 transition cursor-pointer text-xs"
                >
                  Sign Out
                </button>
                <Link
                  to={authSession.role === 'student' ? '/student' : authSession.role === 'officer' ? '/officer' : '/company'}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition shadow-sm text-xs flex items-center gap-1.5"
                >
                  <span>Open {authSession.role === 'student' ? 'Student Portal' : 'Dashboard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Big Stretched 3-Student Demo Cards */}
          {activeTab === 'student' && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Zap className="w-4 h-4 fill-indigo-500 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-['Outfit']">
                      Instant Student Logins (1-Click Access)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Login as <strong>1</strong> (password <strong>1</strong>), <strong>2</strong> (password <strong>2</strong>), or <strong>3</strong> (password <strong>3</strong>)
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-black uppercase">
                  Click Any Card To Enter
                </span>
              </div>

              {/* 3 Stretched Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {studentDemoCards.map((sc) => {
                  const isCurrentSelected = identifier === sc.num && password === sc.num;
                  return (
                    <div
                      key={sc.num}
                      onClick={() => handleShortcutLogin(sc.num)}
                      className={`group relative p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                        isCurrentSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/30 scale-102 ring-4 ring-indigo-500/20'
                          : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 hover:shadow-lg text-slate-900 dark:text-white'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={sc.avatar}
                            alt={sc.name}
                            className={`w-12 h-12 rounded-2xl object-cover border-2 shrink-0 ${
                              isCurrentSelected ? 'border-white' : 'border-indigo-400'
                            }`}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-lg font-black tracking-tight">{sc.name}</h4>
                            </div>
                            <p className={`text-xs font-semibold ${
                              isCurrentSelected ? 'text-indigo-100' : 'text-slate-400'
                            }`}>
                              {sc.branch} • Year 2026
                            </p>
                          </div>
                        </div>

                        {/* Credential Badge */}
                        <div className={`px-2.5 py-1 rounded-xl text-center shrink-0 border ${
                          isCurrentSelected
                            ? 'bg-white/20 border-white/30 text-white'
                            : 'bg-white dark:bg-slate-700 border-indigo-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-300'
                        }`}>
                          <div className="text-[10px] font-black uppercase tracking-wider">Login / Pass</div>
                          <div className="text-sm font-black">{sc.num} / {sc.num}</div>
                        </div>
                      </div>

                      {/* Card Middle Details */}
                      <div className={`p-3 rounded-2xl space-y-1.5 text-xs ${
                        isCurrentSelected ? 'bg-white/10' : 'bg-white/80 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={isCurrentSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400 font-medium'}>
                            Academic CGPA:
                          </span>
                          <strong className="font-black text-sm">{sc.cgpa} / 10.0</strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={isCurrentSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400 font-medium'}>
                            Status:
                          </span>
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            isCurrentSelected ? 'bg-white/25 text-white' : sc.statusClass
                          }`}>
                            {sc.status}
                          </span>
                        </div>
                        <div className="pt-1 border-t border-white/10 dark:border-slate-700/60">
                          <span className={isCurrentSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400 font-medium block'}>
                            Featured Drives:
                          </span>
                          <span className="font-bold block truncate">{sc.highlights}</span>
                        </div>
                      </div>

                      {/* Card Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShortcutLogin(sc.num);
                        }}
                        className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                          isCurrentSelected
                            ? 'bg-white text-indigo-700 hover:bg-indigo-50'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        <span>1-Click Sign In as {sc.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
              {activeTab === 'student' ? 'Or Enter Login & Password Manually' : 'Institutional Credentials'}
            </span>
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
          </div>

          {/* Form - Stretched Grid */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Identifier Input */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                  {activeTab === 'student'
                    ? 'Student Login ID / Name (Enter 1, 2, or 3)'
                    : 'Institutional Email Address'}
                </label>
                <div className="relative">
                  {activeTab === 'student' ? (
                    <GraduationCap className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  ) : (
                    <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  )}
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                    placeholder={
                      activeTab === 'student'
                        ? 'Enter 1, 2, or 3'
                        : activeTab === 'officer'
                          ? 'admin@placement.edu'
                          : 'campus-hiring@google.com'
                    }
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm sm:text-base focus:outline-none focus:border-indigo-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                  {activeTab === 'student'
                    ? 'Password (1 for Student 1, 2 for Student 2, 3 for Student 3)'
                    : 'Security Password'}
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder={activeTab === 'student' ? 'Enter 1, 2, or 3' : '••••••••'}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm sm:text-base focus:outline-none focus:border-indigo-500 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-base text-white bg-gradient-to-r from-indigo-600 via-[#7048e8] to-[#8c52ff] hover:opacity-95 transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.005] active:scale-[0.995] disabled:opacity-70"
            >
              {loading ? (
                <span>Authenticating Credentials…</span>
              ) : (
                <>
                  <span>
                    {activeTab === 'student'
                      ? (identifier === '1'
                          ? 'Sign In as Student 1 (Login: 1 • Password: 1)'
                          : identifier === '2'
                            ? 'Sign In as Student 2 (Login: 2 • Password: 2)'
                            : identifier === '3'
                              ? 'Sign In as Student 3 (Login: 3 • Password: 3)'
                              : `Sign In as Student (${identifier})`)
                      : activeTab === 'officer'
                        ? 'Sign In to Placement Directorate Admin'
                        : 'Sign In to Recruiter Hub'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Admin Hint */}
          {activeTab === 'officer' && (
            <div className="mt-6 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-300 border border-indigo-200 dark:border-indigo-800">
              <span className="font-bold">Directorate Access:</span> Use institutional username <strong className="text-indigo-600 dark:text-indigo-400">admin@placement.edu</strong> with any password.
            </div>
          )}

          {/* Recruiter Hint */}
          {activeTab === 'company' && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-300 border border-emerald-200 dark:border-emerald-800">
              <span className="font-bold">Recruiter Access:</span> Use corporate account <strong className="text-emerald-600 dark:text-emerald-400">campus-hiring@google.com</strong> with any password.
            </div>
          )}

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              ← Back to Campus Placement Portal Overview
            </Link>
          </div>
        </div>

        {/* Footer Subtext */}
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center">
          PlaceIQ System Credentials: <strong>Student 1</strong> (1 / 1) • <strong>Student 2</strong> (2 / 2) • <strong>Student 3</strong> (3 / 3) • <strong>Admin</strong> (admin@placement.edu)
        </p>

      </div>
    </div>
  );
};
