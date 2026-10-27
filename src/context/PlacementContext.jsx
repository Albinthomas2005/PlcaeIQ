import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const PlacementContext = createContext();

export const PlacementProvider = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('placeiq_theme');
    return saved ? saved === 'dark' : false;
  });

  // Current simulation role: 'officer' | 'student' | 'company'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('placeiq_role') || 'officer';
  });

  const [activeStudentId, setActiveStudentId] = useState(() => {
    return localStorage.getItem('placeiq_active_student') || 'std-1';
  });

  const [activeCompanyId, setActiveCompanyId] = useState(() => {
    return localStorage.getItem('placeiq_active_company') || 'cmp-1';
  });

  // Live Database States (fetched via PHP API from SQLite/MySQL database)
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Global Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync theme
  useEffect(() => {
    localStorage.setItem('placeiq_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('placeiq_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('placeiq_active_student', activeStudentId);
  }, [activeStudentId]);

  useEffect(() => {
    localStorage.setItem('placeiq_active_company', activeCompanyId);
  }, [activeCompanyId]);

  // Authentication & Session Management
  const [authSession, setAuthSession] = useState(() => {
    try {
      const saved = localStorage.getItem('placeiq_auth_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse auth session from localStorage', e);
    }
    return {
      isLoggedIn: false,
      role: null,
      user: null
    };
  });

  useEffect(() => {
    localStorage.setItem('placeiq_auth_session', JSON.stringify(authSession));
    if (authSession?.isLoggedIn && authSession?.role) {
      setCurrentRole(authSession.role);
      if (authSession.role === 'student' && authSession.user?.studentId) {
        setActiveStudentId(authSession.user.studentId);
      }
    }
  }, [authSession]);

  // Fetch all records from the PHP Database backend on mount
  const fetchDataFromDatabase = async () => {
    try {
      setDataLoading(true);
      const [resStd, resCmp, resJob, resApp, resInt] = await Promise.all([
        fetch('/api/students.php').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/companies.php').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/jobs.php').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/applications.php').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/interviews.php').then(r => r.json()).catch(() => ({ success: false }))
      ]);

      if (resStd?.success) setStudents(resStd.data || []);
      if (resCmp?.success) setCompanies(resCmp.data || []);
      if (resJob?.success) setJobs(resJob.data || []);
      if (resApp?.success) setApplications(resApp.data || []);
      if (resInt?.success) setInterviews(resInt.data || []);
    } catch (err) {
      console.error('Error fetching data from database:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromDatabase();
  }, []);

  // Login authentication calling PHP backend against database
  const login = async (identifier, password = '', roleHint = null) => {
    try {
      const response = await fetch('/api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, roleHint })
      });
      const data = await response.json();

      if (data.success) {
        setAuthSession({
          isLoggedIn: true,
          role: data.role,
          user: data.user
        });
        setCurrentRole(data.role);
        if (data.role === 'student' && data.user?.studentId) {
          setActiveStudentId(data.user.studentId);
        } else if (data.role === 'company' && data.user?.companyId) {
          setActiveCompanyId(data.user.companyId);
        }
        showToast(`Welcome, ${data.user.name}!`, 'success');
        fireConfetti();
        return { success: true, role: data.role, path: data.path };
      } else {
        showToast(data.message || 'Authentication failed', 'error');
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Database auth error:', err);
      showToast('Error communicating with database backend.', 'error');
      return { success: false, message: 'Server communication error' };
    }
  };

  const logout = () => {
    setAuthSession({
      isLoggedIn: false,
      role: null,
      user: null
    });
    localStorage.removeItem('placeiq_auth_session');
    showToast('Signed out of placement portal', 'info');
  };

  // Active candidate and recruiter profiles resolved directly from live database state
  const currentStudent = (() => {
    if (authSession?.isLoggedIn && authSession?.role === 'student' && authSession?.user?.studentId) {
      const authenticated = students.find(s => s.id === authSession.user.studentId);
      if (authenticated) return authenticated;
      return authSession.user;
    }
    return students.find(s => s.id === activeStudentId) || students[0] || null;
  })();

  const currentCompany = companies.find(c => c.id === activeCompanyId) || companies[0] || null;

  const isAdmin = Boolean(authSession?.isLoggedIn && authSession?.role === 'officer');

  const fireConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

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

  // Job Application: Saves directly into Database via PHP API
  const applyForJob = async (jobId, studentId = currentStudent.id, note = '') => {
    const student = students.find(s => s.id === studentId);
    const job = jobs.find(j => j.id === jobId);

    if (!student || !job) {
      showToast('Student or Job record not found.', 'error');
      return { success: false, message: 'Invalid records' };
    }

    const existing = applications.find(a => a.jobId === jobId && a.studentId === studentId);
    if (existing) {
      showToast(`You have already applied for ${job.title} at ${job.companyName}!`, 'warning');
      return { success: false, message: 'Already applied' };
    }

    try {
      const response = await fetch('/api/applications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, studentId, note })
      });
      const data = await response.json();

      if (data.success && data.data) {
        setApplications(prev => [data.data, ...prev]);
        showToast(data.message || `Application successfully submitted for ${job.title}!`, 'success');
        fireConfetti();
        return { success: true };
      } else {
        showToast(data.message || 'Failed to submit application', 'error');
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Error applying for job in database:', err);
      showToast('Database error while submitting application', 'error');
      return { success: false };
    }
  };

  // Update Application Status in Database via PHP API
  const updateApplicationStatus = async (appId, newStatus, offeredPackage = null, feedbackNote = '') => {
    try {
      const response = await fetch('/api/applications.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId, status: newStatus, offeredPackage, notes: feedbackNote })
      });
      const data = await response.json();

      if (data.success && data.data) {
        setApplications(prev => prev.map(a => a.id === appId ? data.data : a));
        if (newStatus === 'Offered') {
          // Re-sync students list to reflect placed status
          fetch('/api/students.php')
            .then(r => r.json())
            .then(res => { if (res.success) setStudents(res.data); });
          fireConfetti();
        }
        showToast(`Candidate status updated to "${newStatus}" in database!`, 'success');
      }
    } catch (err) {
      console.error('Failed to update status in database:', err);
      showToast('Failed to update application in database', 'error');
    }
  };

  // Schedule Interview in Database via PHP API
  const scheduleInterview = async (interviewData) => {
    try {
      const response = await fetch('/api/interviews.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interviewData)
      });
      const data = await response.json();

      if (data.success && data.data) {
        setInterviews(prev => [data.data, ...prev]);
        // Also refresh applications to reflect interview round
        fetch('/api/applications.php')
          .then(r => r.json())
          .then(res => { if (res.success) setApplications(res.data); });
        showToast(`Interview scheduled and saved to database!`, 'success');
      }
    } catch (err) {
      console.error('Failed to schedule interview:', err);
      showToast('Error saving interview schedule', 'error');
    }
  };

  // CRUD for Students: Saved to Database via PHP API
  const addStudent = async (studentData) => {
    try {
      const response = await fetch('/api/students.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });
      const data = await response.json();
      if (data.success && data.data) {
        setStudents(prev => [data.data, ...prev]);
        showToast(data.message || 'Student enrolled into placement database!', 'success');
      }
    } catch (err) {
      console.error('Error adding student:', err);
      showToast('Failed to enroll student', 'error');
    }
  };

  const updateStudent = async (id, updatedFields) => {
    try {
      const response = await fetch('/api/students.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedFields })
      });
      const data = await response.json();
      if (data.success && data.data) {
        setStudents(prev => prev.map(s => s.id === id ? data.data : s));
        setAuthSession(prev => {
          if (prev?.isLoggedIn && prev?.user?.studentId === id) {
            return {
              ...prev,
              user: {
                ...prev.user,
                ...updatedFields
              }
            };
          }
          return prev;
        });
        showToast('Student profile updated in database', 'info');
      }
    } catch (err) {
      console.error('Error updating student:', err);
      showToast('Failed to update student profile', 'error');
    }
  };

  const deleteStudent = async (id) => {
    try {
      const response = await fetch(`/api/students.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setStudents(prev => prev.filter(s => s.id !== id));
        showToast('Student profile removed from database', 'warning');
      }
    } catch (err) {
      console.error('Error deleting student:', err);
      showToast('Failed to remove student', 'error');
    }
  };

  // CRUD for Companies: Saved to Database via PHP API
  const addCompany = async (companyData) => {
    try {
      const response = await fetch('/api/companies.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      });
      const data = await response.json();
      if (data.success && data.data) {
        setCompanies(prev => [data.data, ...prev]);
        showToast(`Company registered in database!`, 'success');
      }
    } catch (err) {
      console.error('Error adding company:', err);
      showToast('Failed to register company', 'error');
    }
  };

  const updateCompany = async (id, updatedFields) => {
    try {
      const response = await fetch('/api/companies.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedFields })
      });
      const data = await response.json();
      if (data.success && data.data) {
        setCompanies(prev => prev.map(c => c.id === id ? data.data : c));
        showToast('Company record updated in database', 'info');
      }
    } catch (err) {
      console.error('Error updating company:', err);
    }
  };

  const deleteCompany = async (id) => {
    try {
      const response = await fetch(`/api/companies.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setCompanies(prev => prev.filter(c => c.id !== id));
        showToast('Company record removed from database', 'warning');
      }
    } catch (err) {
      console.error('Error deleting company:', err);
    }
  };

  // CRUD for Jobs: Saved to Database via PHP API
  const addJob = async (jobData) => {
    try {
      const response = await fetch('/api/jobs.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      const data = await response.json();
      if (data.success && data.data) {
        setJobs(prev => [data.data, ...prev]);
        showToast(`Campus drive published: ${data.data.title}!`, 'success');
      }
    } catch (err) {
      console.error('Error adding job:', err);
      showToast('Failed to publish drive', 'error');
    }
  };

  const updateJob = async (id, updatedFields) => {
    try {
      const response = await fetch('/api/jobs.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedFields })
      });
      const data = await response.json();
      if (data.success && data.data) {
        setJobs(prev => prev.map(j => j.id === id ? data.data : j));
        showToast('Job listing updated in database', 'info');
      }
    } catch (err) {
      console.error('Error updating job:', err);
    }
  };

  const deleteJob = async (id) => {
    try {
      const response = await fetch(`/api/jobs.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setJobs(prev => prev.filter(j => j.id !== id));
        showToast('Job listing archived in database', 'warning');
      }
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  // Reset to Baseline Database State
  const resetToDemoData = async () => {
    try {
      const response = await fetch('/api/reset.php', { method: 'POST' });
      const data = await response.json();
      if (data.success && data.data) {
        setStudents(data.data.students || []);
        setCompanies(data.data.companies || []);
        setJobs(data.data.jobs || []);
        setApplications(data.data.applications || []);
        setInterviews(data.data.interviews || []);
        setCurrentRole('officer');
        setActiveStudentId('std-1');
        setActiveCompanyId('cmp-1');
        showToast('Placement directory successfully synchronized with database!', 'success');
      }
    } catch (err) {
      console.error('Error resetting database:', err);
      showToast('Failed to reset database', 'error');
    }
  };

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
