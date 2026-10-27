import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, 
  Sparkles, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  GraduationCap, 
  Building2, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  ChevronRight,
  Zap,
  Target,
  FileCheck,
  Star,
  Activity,
  LogIn
} from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';

export const HomePage = () => {
  const navigate = useNavigate();
  const { 
    students, 
    companies, 
    jobs, 
    authSession,
    currentStudent,
  } = usePlacement();

  const placedCount = students.filter(s => s.status === 'Placed').length;
  const placementRate = students.length > 0 ? Math.round((placedCount / students.length) * 100) : 0;
  const peakCtc = jobs.reduce((max, j) => Math.max(max, parseFloat(j.packageCtc) || 0), 0);
  const featuredOffer = students.find(s => s.placedCompany && s.placedPackage) || (jobs[0] ? { placedCompany: jobs[0].companyName, placedPackage: jobs[0].packageDisplay } : null);
  const topStipend = jobs.find(j => j.stipend)?.stipend || 'Competitive Stipend';

  // Portal card clicks: if logged in go to dashboard, else go to login
  const handleRoleSelect = (requiredRole, dashPath) => {
    if (authSession?.isLoggedIn && authSession?.role === requiredRole) {
      navigate(dashPath);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#704df6] via-[#613ae5] to-[#4d25d0] dark:from-[#4928b8] dark:via-[#391d9c] dark:to-[#281177] p-2 sm:p-4 lg:p-6 transition-colors duration-300 min-h-screen">
      
      {/* Central Modern Bento Container - Full width stretch */}
      <div className="w-full mx-auto bg-white dark:bg-[#121420] rounded-[24px] sm:rounded-[36px] shadow-2xl p-6 sm:p-10 lg:p-14 border border-white/70 dark:border-slate-800/80 relative overflow-hidden">
        
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-100/40 via-purple-50/20 to-transparent dark:from-indigo-950/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-100/30 to-transparent dark:from-purple-950/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Authenticated candidate welcome banner */}
        {authSession?.isLoggedIn && (
          <div className="relative z-10 mb-8 p-4 sm:p-5 rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">Logged in candidate:</span>
              <strong className="text-slate-900 dark:text-white font-black text-base">
                {authSession.role === 'student' ? currentStudent.name : authSession.user?.name}
              </strong>
              {authSession.role === 'student' && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-black border border-indigo-300 dark:border-indigo-700">
                  {currentStudent.cgpa} CGPA • {currentStudent.branchCode}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-3 py-1.5"
              >
                Switch Student Account
              </Link>
              <Link
                to={authSession.role === 'student' ? '/student' : '/officer'}
                className="px-4 py-2 rounded-xl bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white text-xs font-black shadow-md hover:opacity-95 transition-all"
              >
                Enter My Dashboard →
              </Link>
            </div>
          </div>
        )}

        {/* HERO SECTION */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center mb-12 sm:mb-16">
          
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            
            {/* Sparkle Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm sm:text-base font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-[#7048e8] animate-spin" style={{ animationDuration: '6s' }} />
              <span>✦ No.1 Campus Recruitment Platform</span>
            </div>

            {/* Main Grand Headline with Inline Avatar Pills */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.0] font-['Outfit']">
              YOUR{' '}
              <span className="inline-flex items-center -space-x-3 align-middle mx-1.5 px-2 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                  alt="Candidate" 
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-sm"
                />
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" 
                  alt="Recruiter" 
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-sm"
                />
              </span>{' '}
              OWN <br />
              PLACEMENT <br />
              PLATFORM
            </h1>

            <p className="text-lg sm:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 max-w-3xl font-normal leading-relaxed">
              A centralized campus recruitment ecosystem orchestrating verified student profiles, corporate drives, automated live eligibility verification, interview coordination, and directorate-authorized digital offer letters.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={authSession?.isLoggedIn ? (authSession.role === 'student' ? '/student' : authSession.role === 'officer' ? '/officer' : '/company') : '/login'}
                className="px-10 py-5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-base sm:text-lg tracking-wider uppercase hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3.5 group"
              >
                <span>{authSession?.isLoggedIn ? 'ENTER PORTAL' : 'GET STARTED'}</span>
                <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </Link>

              <Link
                to="/login"
                className="px-8 py-5 rounded-full bg-gradient-to-r from-indigo-600 to-[#7d5fff] text-white font-black text-base sm:text-lg hover:opacity-95 transition-all shadow-xl hover:scale-105 flex items-center gap-2.5"
              >
                <LogIn className="w-5 h-5" />
                <span>Student & Admin Login</span>
              </Link>

              <Link
                to="/jobs"
                className="px-8 py-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-base sm:text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 hover:scale-105"
              >
                Explore Active Drives ({jobs.length})
              </Link>
            </div>

            {/* Live Trust Metrics Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-10 text-base sm:text-lg font-bold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <span>{placementRate}% Placement Rate</span>
              </div>
              <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400">
                <Award className="w-6 h-6 shrink-0" />
                <span>₹{peakCtc > 0 ? peakCtc : '20+'} LPA Peak CTC</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
                <Building2 className="w-6 h-6 text-[#7048e8] shrink-0" />
                <span>{companies.length}+ Recruiting Partners</span>
              </div>
            </div>

          </div>

          {/* Hero Right Column: Photo with 100% visible, unobstructed face */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            <div className="relative w-full max-w-lg lg:max-w-xl pb-16">
              
              {/* Photo Card: High quality portrait where face is completely clear and positioned in top-half */}
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-2 border-white/60 dark:border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000&auto=format&fit=crop&q=80"
                  alt="Campus Professional Candidate"
                  className="w-full h-[420px] sm:h-[480px] lg:h-[500px] object-cover object-[center_top]"
                />

                {/* Status Dot */}
                <div className="absolute top-5 right-5 w-4 h-4 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Clean gradient overlay at bottom of photo (well below the face) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white pointer-events-none">
                  <span className="text-xs uppercase tracking-widest font-black text-indigo-300">Cohort 2026</span>
                  <p className="text-xl sm:text-2xl font-black">Top Tier Engineering Recruits</p>
                  <p className="text-sm text-slate-300 mt-0.5">Verified credentials & direct interview pipeline</p>
                </div>
              </div>

              {/* Overlapping Glass Card: Manage your placement easy - Positioned at bottom overlapping ONLY lower torso, NOT THE FACE! */}
              <div className="absolute -bottom-4 left-4 right-4 sm:-bottom-6 sm:left-auto sm:right-6 sm:w-[340px] rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl border-2 border-slate-200/80 dark:border-slate-800 animate-float z-20">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#7048e8]/15 text-[#7048e8] flex items-center justify-center font-black text-base">
                    ✦
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Live Season
                  </span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                  Manage your placement <span className="text-[#7048e8]">easy</span>
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-snug">
                  Automated eligibility engine, live round notifications & digital verified offer letters.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* BOTTOM BENTO GRID (3 large, prominent, readable cards) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-12 sm:pt-16 border-t-2 border-slate-100 dark:border-slate-800">
          
          {/* Bento Card 1: Experience & Quote */}
          <div className="md:col-span-4 rounded-3xl bg-slate-50/90 dark:bg-slate-900/80 p-6 sm:p-8 border-2 border-slate-200/90 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-400 transition-all shadow-sm">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-snug font-['Outfit']">
                  The most experienced, accredited placement cell across premier university institutions.
                </p>
                <span className="text-5xl font-serif text-slate-300 dark:text-slate-600 font-black">“</span>
              </div>
              <Link 
                to="/officer" 
                className="inline-flex items-center gap-2 text-base sm:text-lg font-black text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 underline underline-offset-4"
              >
                <span>Work with our Placement Cell</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex -space-x-3">
                <img src={students[0]?.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-900 object-cover shadow-sm" />
                <img src={students[1]?.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-900 object-cover shadow-sm" />
                <img src={students[2]?.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-900 object-cover shadow-sm" />
              </div>
              <div className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                <span className="font-black text-slate-900 dark:text-white text-lg">{students.length}</span> Graduating students enrolled
              </div>
            </div>
          </div>

          {/* Bento Card 2: Interactive Candidate Profile (Matches "Alies Westervett" card) */}
          <div className="md:col-span-4 rounded-3xl bg-slate-50/90 dark:bg-slate-900/80 p-6 sm:p-8 border-2 border-slate-200/90 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-400 transition-all shadow-sm">
            
            {/* Top notification pill */}
            <div className="mb-4">
              <div className="px-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between shadow-xs">
                <span className="truncate">
                  {featuredOffer ? `Active Offer: ${featuredOffer.placedPackage} (${featuredOffer.placedCompany})` : 'Recruitment Season Active'}
                </span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 ml-2 animate-pulse" />
              </div>
            </div>

            {/* Candidate avatar & stats */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={students[0]?.avatar}
                  alt={students[0]?.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-md"
                />
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{students[0]?.name}</h4>
                  <p className="text-sm sm:text-base text-slate-500 font-medium">{students[0]?.branchCode} • CGPA {students[0]?.cgpa}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">{students[0]?.skills?.length || 0}</span>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Skills</p>
              </div>
            </div>

            {/* Stipend & Circle progress widget */}
            <div className="flex items-center justify-between pt-5">
              <div>
                <p className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider">Top Campus Stipend</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{topStipend}</p>
                <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-black mt-0.5">Eligibility: 100%</p>
              </div>

              {/* Large SVG circular progress gauge */}
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 flex items-center justify-center">
                <svg className="w-18 h-18 sm:w-20 sm:h-20 -rotate-90">
                  <circle cx="40" cy="40" r="32" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="6" fill="none" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="32" 
                    className="stroke-[#7048e8]" 
                    strokeWidth="6" 
                    strokeDasharray="201" 
                    strokeDashoffset="24" 
                    strokeLinecap="round" 
                    fill="none" 
                  />
                </svg>
                <span className="absolute text-sm sm:text-base font-black text-slate-800 dark:text-slate-200">{placementRate}%</span>
              </div>
            </div>

          </div>

          {/* Bento Card 3: Conversion Rate & Wave Graph (Matches "35.6% Conversion rate" card) */}
          <div className="md:col-span-4 rounded-3xl bg-slate-50/90 dark:bg-slate-900/80 p-6 sm:p-8 border-2 border-slate-200/90 dark:border-slate-800 flex flex-col justify-between hover:border-indigo-400 transition-all shadow-sm">
            
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white font-['Outfit']">
                    {placementRate}%
                  </h3>
                  <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-bold mt-1">Placement Conversion Rate</p>
                </div>
                <div className="w-11 h-11 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              {/* Taller, prominent smooth wave line chart */}
              <div className="py-4">
                <svg viewBox="0 0 320 70" className="w-full h-20 sm:h-24 overflow-visible">
                  <path
                    d="M 0 50 Q 32 15 64 42 T 128 18 T 192 48 T 256 12 T 320 32"
                    fill="none"
                    stroke="#1e293b"
                    className="dark:stroke-slate-200"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="192" cy="48" r="6" className="fill-[#7048e8]" />
                  <circle cx="256" cy="12" r="6" className="fill-emerald-500" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">₹18,40,000 Avg CTC</span>
              <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">+14.79% YoY ↑</span>
            </div>

          </div>

        </div>

        {/* RECRUITER PARTNER LOGOS BAR */}
        <div className="mt-12 pt-8 border-t-2 border-slate-100 dark:border-slate-800">
          <p className="text-center text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-400 mb-6">
            Trusted by World-Class Technology & Consulting Enterprises
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
            {companies.map(c => (
              <div 
                key={c.id} 
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3 hover:shadow-lg hover:border-indigo-400 transition-all"
              >
                <Building2 className="w-5 h-5 text-indigo-500 shrink-0" />
                <span className="text-base font-black text-slate-800 dark:text-slate-100 truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3 QUICK PORTAL ENTRY CARDS */}
        <div className="mt-12 pt-8 border-t-2 border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-['Outfit'] mb-6 text-center">
            Select Your Placement Console
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* TPO Card */}
            <div 
              onClick={() => handleRoleSelect('officer', '/officer')}
              className="p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-indigo-50/60 to-white dark:from-slate-800/60 dark:to-slate-900 border-2 border-indigo-100 dark:border-slate-800 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#6c5ce7] text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">Placement Officer Directorate</h3>
              <p className="text-base text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Coordinate campus drives, analyze department placement rates, verify student backlogs, and schedule panel interviews.
              </p>
              <div className="mt-5 flex items-center gap-2 text-base font-black text-indigo-600 dark:text-indigo-400">
                <span>{authSession?.isLoggedIn && authSession?.role === 'officer' ? 'Open Officer Console' : 'Login as Admin →'}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

            {/* Student Card */}
            <div 
              onClick={() => handleRoleSelect('student', '/student')}
              className="p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-purple-50/60 to-white dark:from-slate-800/60 dark:to-slate-900 border-2 border-purple-100 dark:border-slate-800 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#7048e8] text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">Student Job & Profile Hub</h3>
              <p className="text-base text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Live criteria eligibility checking, 1-click job application, real-time round notifications, and digital offer letter celebration.
              </p>
              <div className="mt-5 flex items-center gap-2 text-base font-black text-[#7048e8] dark:text-purple-400">
                <span>{authSession?.isLoggedIn && authSession?.role === 'student' ? 'Open Student Portal' : 'Login as Student →'}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

            {/* Recruiter Card */}
            <div 
              onClick={() => handleRoleSelect('company', '/company')}
              className="p-7 sm:p-8 rounded-3xl bg-gradient-to-b from-emerald-50/60 to-white dark:from-slate-800/60 dark:to-slate-900 border-2 border-emerald-100 dark:border-slate-800 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-md">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">Corporate Recruiter Console</h3>
              <p className="text-base text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                Publish drive requirements, filter candidates by CGPA, conduct technical rounds, and rollout formal placement offers.
              </p>
              <div className="mt-5 flex items-center gap-2 text-base font-black text-emerald-600 dark:text-emerald-400">
                <span>{authSession?.isLoggedIn && authSession?.role === 'company' ? 'Open Recruiter Console' : 'Login as Recruiter →'}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
