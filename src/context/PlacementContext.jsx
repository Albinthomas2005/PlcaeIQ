import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const PlacementContext = createContext();

export const PlacementProvider = ({ children }) => {
  // Demo records, persisted locally. These replace the unavailable PHP API.
  const readStore=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback;}catch{return fallback;}};
  const demoStudents=[
    {id:'std-1',name:'Student 1',rollNo:'1',email:'student1@campus.edu',phone:'+91 98765 43210',department:'Computer Science & Engineering',branchCode:'CSE',cgpa:9.4,backlogs:0,passingYear:2026,skills:['React','Node.js','Python','SQL'],status:'Seeking'},
    {id:'std-2',name:'Student 2',rollNo:'2',email:'student2@campus.edu',department:'Electronics & Communication',branchCode:'ECE',cgpa:7.15,backlogs:0,passingYear:2026,skills:['C','Python'],status:'Seeking'},
    {id:'std-3',name:'Student 3',rollNo:'3',email:'student3@campus.edu',department:'Computer Science & Engineering',branchCode:'CSE',cgpa:9.35,backlogs:0,passingYear:2026,skills:['Java','React'],status:'Placed',placedCompany:'Microsoft IDC',placedPackage:'22 LPA'}
  ];
  const demoCompanies=[
    {id:'cmp-1',name:'Google India',industry:'Technology / Cloud / AI',website:'https://careers.google.com',location:'Bengaluru / Hyderabad',hrContact:'Campus Hiring Team',email:'campus-hiring@google.com',tier:'Tier 1 (Dream)',status:'Active',totalHires:18,avgPackage:'28.5 LPA'},
    {id:'cmp-2',name:'Microsoft IDC',industry:'Cloud Computing / Enterprise Software',website:'https://careers.microsoft.com',location:'Bengaluru / Hyderabad',hrContact:'Talent Acquisition',email:'idc-recruitment@microsoft.com',tier:'Tier 1 (Dream)',status:'Active',totalHires:24,avgPackage:'22.0 LPA'},
    {id:'cmp-3',name:'Amazon Development Centre',industry:'E-Commerce / Cloud',website:'https://amazon.jobs',location:'Bengaluru',hrContact:'Campus Hiring',email:'university@amazon.com',tier:'Tier 1 (Dream)',status:'Active',totalHires:12,avgPackage:'18 LPA'}
  ];
  const demoJobs=[
    {id:'job-1',companyId:'cmp-1',companyName:'Google India',title:'Software Engineer',role:'Software Development',location:'Bengaluru / Hybrid',packageCtc:'28.5',minCgpa:7.5,maxBacklogs:0,allowedBranches:['CSE','IT','ECE'],deadline:'2027-01-15',vacancies:10,status:'Open'},
    {id:'job-2',companyId:'cmp-2',companyName:'Microsoft IDC',title:'Associate Software Engineer',role:'Engineering',location:'Hyderabad',packageCtc:'22',minCgpa:7,maxBacklogs:0,allowedBranches:['CSE','IT','ECE'],deadline:'2027-01-20',vacancies:8,status:'Open'},
    {id:'job-3',companyId:'cmp-3',companyName:'Amazon Development Centre',title:'Graduate SDE',role:'Software Development',location:'Bengaluru',packageCtc:'18',minCgpa:7,maxBacklogs:0,allowedBranches:['CSE','IT'],deadline:'2027-01-25',vacancies:12,status:'Open'}
  ];
  const [students,setStudents]=useState(()=>readStore('placeiq_students',demoStudents));
  const [companies,setCompanies]=useState(()=>readStore('placeiq_companies',demoCompanies));
  const [jobs,setJobs]=useState(()=>readStore('placeiq_jobs',demoJobs));
  const [applications,setApplications]=useState(()=>readStore('placeiq_applications',[]));
  const [interviews,setInterviews]=useState(()=>readStore('placeiq_interviews',[]));
  const [dataLoading,setDataLoading]=useState(false);
  const [toast,setToast]=useState(null);
  const showToast=(message,type='info')=>{setToast({message,type,id:Date.now()});setTimeout(()=>setToast(null),4000);};
  const [darkMode,setDarkMode]=useState(()=>localStorage.getItem('placeiq_theme')==='dark');
  const [currentRole,setCurrentRole]=useState(()=>localStorage.getItem('placeiq_role')||'officer');
  const [activeStudentId,setActiveStudentId]=useState(()=>localStorage.getItem('placeiq_active_student')||'std-1');
  const [activeCompanyId,setActiveCompanyId]=useState(()=>localStorage.getItem('placeiq_active_company')||'cmp-1');
  const [authSession,setAuthSession]=useState(()=>readStore('placeiq_auth_session',{isLoggedIn:false,role:null,user:null}));
  useEffect(()=>{localStorage.setItem('placeiq_theme',darkMode?'dark':'light');document.documentElement.classList.toggle('dark',darkMode);},[darkMode]);
  useEffect(()=>{localStorage.setItem('placeiq_role',currentRole);},[currentRole]);
  useEffect(()=>{localStorage.setItem('placeiq_active_student',activeStudentId);},[activeStudentId]);
  useEffect(()=>{localStorage.setItem('placeiq_active_company',activeCompanyId);},[activeCompanyId]);
  useEffect(()=>{localStorage.setItem('placeiq_auth_session',JSON.stringify(authSession));},[authSession]);
  useEffect(()=>{localStorage.setItem('placeiq_students',JSON.stringify(students));},[students]);
  useEffect(()=>{localStorage.setItem('placeiq_companies',JSON.stringify(companies));},[companies]);
  useEffect(()=>{localStorage.setItem('placeiq_jobs',JSON.stringify(jobs));},[jobs]);
  useEffect(()=>{localStorage.setItem('placeiq_applications',JSON.stringify(applications));},[applications]);
  useEffect(()=>{localStorage.setItem('placeiq_interviews',JSON.stringify(interviews));},[interviews]);
  const fetchDataFromDatabase=async()=>({success:true,mode:'local'});
  const login=async(identifier,password='',roleHint=null)=>{
    const id=String(identifier||'').trim().toLowerCase(),pass=String(password||'');
    let role=null,user=null,path='/login';
    if(roleHint==='officer'&&['admin@placement.edu','admin'].includes(id)&&pass==='admin123'){
      role='officer';user={name:'Dr. Aris Thorne',email:'admin@placement.edu',role};path='/officer';
    }else if(roleHint==='company'&&id==='campus-hiring@google.com'&&pass==='hiring123'){
      role='company';user={name:'Google India',email:id,role,companyId:'cmp-1'};path='/company';
    }else if(roleHint==='student'){
      const student=students.find(s=>String(s.rollNo||s.id).toLowerCase()===id||String(s.email||'').toLowerCase()===id);
      if(student&&pass===String(student.rollNo)){role='student';user={...student,studentId:student.id,role};path='/student';}
    }
    if(!role){const message='Invalid login ID or password.';showToast(message,'error');return {success:false,message};}
    setAuthSession({isLoggedIn:true,role,user});setCurrentRole(role);
    if(role==='student')setActiveStudentId(user.studentId);
    if(role==='company')setActiveCompanyId(user.companyId);
    showToast('Welcome, '+user.name+'!','success');fireConfetti();return {success:true,role,path};
  };
  const logout=()=>{setAuthSession({isLoggedIn:false,role:null,user:null});localStorage.removeItem('placeiq_auth_session');showToast('Signed out of placement portal','info');};
  const currentStudent=(()=>{if(authSession?.isLoggedIn&&authSession.role==='student'&&authSession.user?.studentId)return students.find(s=>s.id===authSession.user.studentId)||authSession.user;return students.find(s=>s.id===activeStudentId)||students[0]||null;})();
  const currentCompany=companies.find(c=>c.id===(authSession?.role==='company'?authSession.user?.companyId:activeCompanyId))||companies[0]||null;
  const isAdmin=Boolean(authSession?.isLoggedIn&&authSession.role==='officer');
  const fireConfetti=()=>confetti({particleCount:120,spread:75,origin:{y:0.6}});
  // Eligibility Engine
  const checkEligibility = (student, job) => {
    if (!student || !job) {
      return { 
        eligible: false, 
        meetsRequirements: false, 
        cgpaOk: false, 
        branchOk: false, 
        backlogsOk: false, 
        reasons: ['Profile or Drive data unavailable'] 
      };
    }

    const studentCgpa = parseFloat(student.cgpa) || 0;
    const requiredCgpa = parseFloat(job.minCgpa) || 0;
    const cgpaOk = studentCgpa >= requiredCgpa;

    const studentBranch = (student.branchCode || student.branch || '').toUpperCase();
    const allowedBranches = Array.isArray(job.allowedBranches) 
      ? job.allowedBranches.map(b => b.toUpperCase()) 
      : [];
    const branchOk = allowedBranches.length === 0 || allowedBranches.includes(studentBranch) || allowedBranches.includes('ALL');

    const studentBacklogs = parseInt(student.backlogs, 10) || 0;
    const maxAllowedBacklogs = parseInt(job.maxBacklogs, 10) || 0;
    const backlogsOk = studentBacklogs <= maxAllowedBacklogs;

    const reasons = [];
    if (!cgpaOk) {
      reasons.push(`CGPA ${studentCgpa.toFixed(2)} is below cutoff ${requiredCgpa.toFixed(2)}`);
    }
    if (!branchOk) {
      reasons.push(`Branch ${studentBranch} is not eligible (Allowed: ${allowedBranches.join(', ')})`);
    }
    if (!backlogsOk) {
      reasons.push(`Active backlogs (${studentBacklogs}) exceed maximum allowed (${maxAllowedBacklogs})`);
    }

    const meetsRequirements = cgpaOk && branchOk && backlogsOk;

    return {
      eligible: meetsRequirements,
      meetsRequirements,
      cgpaOk,
      branchOk,
      backlogsOk,
      reasons
    };
  };



  const applyForJob=async(jobId,studentId=currentStudent?.id,note='')=>{
    const student=students.find(s=>s.id===studentId),job=jobs.find(j=>j.id===jobId);
    if(!student||!job){showToast('Student or job record not found.','error');return {success:false};}
    if(applications.some(x=>x.jobId===jobId&&x.studentId===studentId)){showToast('You have already applied for this job.','warning');return {success:false,message:'Already applied'};}
    const item={id:'app-'+Date.now(),jobId,studentId,companyId:job.companyId,companyName:job.companyName,jobTitle:job.title,studentName:student.name,studentRoll:student.rollNo,studentBranch:student.branchCode,status:'Applied',note,appliedAt:new Date().toISOString()};
    setApplications(p=>[item,...p]);showToast('Application submitted successfully!','success');fireConfetti();return {success:true};
  };
  const updateApplicationStatus=async(id,status,offeredPackage=null,feedbackNote='')=>{
    const app=applications.find(x=>x.id===id);
    setApplications(p=>p.map(x=>x.id===id?{...x,status,offeredPackage:offeredPackage??x.offeredPackage,notes:feedbackNote}:x));
    if(status==='Offered'&&app){setStudents(p=>p.map(s=>s.id===app.studentId?{...s,status:'Placed',placedCompany:app.companyName,placedPackage:offeredPackage||s.placedPackage}:s));fireConfetti();}
    showToast('Candidate status updated to '+status+'.','success');
  };
  const scheduleInterview=async(data)=>{
    const item={id:'int-'+Date.now(),...data};setInterviews(p=>[item,...p]);showToast('Interview scheduled successfully!','success');return {success:true,data:item};
  };
  const addStudent=async(data)=>{const item={id:'std-'+Date.now(),status:'Seeking',backlogs:0,...data};setStudents(p=>[item,...p]);showToast('Student enrolled successfully!','success');return item;};
  const updateStudent=async(id,fields)=>{setStudents(p=>p.map(x=>x.id===id?{...x,...fields}:x));setAuthSession(p=>p?.user?.studentId===id?{...p,user:{...p.user,...fields}}:p);showToast('Student profile updated.','success');};
  const deleteStudent=async(id)=>{setStudents(p=>p.filter(x=>x.id!==id));setApplications(p=>p.filter(x=>x.studentId!==id));showToast('Student removed.','warning');};
  const addCompany=async(data)=>{const item={id:'cmp-'+Date.now(),status:'Active',...data};setCompanies(p=>[item,...p]);showToast('Company added successfully!','success');return item;};
  const updateCompany=async(id,fields)=>{setCompanies(p=>p.map(x=>x.id===id?{...x,...fields}:x));showToast('Company updated.','success');};
  const deleteCompany=async(id)=>{setCompanies(p=>p.filter(x=>x.id!==id));showToast('Company removed.','warning');};
  const addJob=async(data)=>{const company=companies.find(x=>x.id===(data.companyId||activeCompanyId))||currentCompany;const item={id:'job-'+Date.now(),status:'Open',companyId:company?.id,companyName:company?.name,...data};setJobs(p=>[item,...p]);showToast('Campus drive published: '+item.title,'success');return item;};
  const updateJob=async(id,fields)=>{setJobs(p=>p.map(x=>x.id===id?{...x,...fields}:x));showToast('Job listing updated.','success');};
  const deleteJob=async(id)=>{setJobs(p=>p.map(x=>x.id===id?{...x,status:'Closed'}:x));showToast('Job listing closed.','warning');};
  const resetToDemoData=async()=>{setStudents(demoStudents);setCompanies(demoCompanies);setJobs(demoJobs);setApplications([]);setInterviews([]);setCurrentRole('officer');setActiveStudentId('std-1');setActiveCompanyId('cmp-1');showToast('Demo data reset successfully.','success');};

  return (
    <PlacementContext.Provider
      value={{
        darkMode,
        setDarkMode,
        currentRole,
        setCurrentRole,
        activeStudentId,
        setActiveStudentId,
        activeCompanyId,
        setActiveCompanyId,
        students,
        companies,
        jobs,
        applications,
        interviews,
        currentStudent,
        currentCompany,
        isAdmin,
        dataLoading,
        applyForJob,
        updateApplicationStatus,
        scheduleInterview,
        addStudent,
        updateStudent,
        deleteStudent,
        addCompany,
        updateCompany,
        deleteCompany,
        addJob,
        updateJob,
        deleteJob,
        checkEligibility,
        resetToDemoData,
        showToast,
        fireConfetti,
        authSession,
        login,
        logout,
        fetchDataFromDatabase
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-5 py-3 rounded-2xl shadow-2xl text-white font-bold text-sm flex items-center gap-3 ${
              toast.type === 'success'
                ? 'bg-emerald-600 border border-emerald-400'
                : toast.type === 'error'
                  ? 'bg-rose-600 border border-rose-400'
                  : toast.type === 'warning'
                    ? 'bg-amber-600 border border-amber-400'
                    : 'bg-indigo-600 border border-indigo-400'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </PlacementContext.Provider>
  );
};

export const usePlacement = () => {
  const context = useContext(PlacementContext);
  if (!context) {
    throw new Error('usePlacement must be used within a PlacementProvider');
  }
  return context;
};
