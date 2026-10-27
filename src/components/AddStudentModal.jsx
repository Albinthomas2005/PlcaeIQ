import React, { useState } from 'react';
import { UserPlus, X, GraduationCap, Mail, Phone, BookOpen, Star, AlertTriangle } from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';

export const AddStudentModal = ({ isOpen, onClose }) => {
  const { addStudent, showToast } = usePlacement();

  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [branchCode, setBranchCode] = useState('CSE');
  const [cgpa, setCgpa] = useState('8.0');
  const [backlogs, setBacklogs] = useState('0');
  const [skills, setSkills] = useState('React, Python, SQL, DSA');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !rollNo || !email) {
      showToast('Please fill out all required fields (Name, Roll No, Email).', 'error');
      return;
    }

    addStudent({
      name,
      rollNo,
      email,
      phone: phone || '+91 98765 00000',
      department,
      branchCode,
      cgpa: parseFloat(cgpa) || 7.0,
      backlogs: parseInt(backlogs, 10) || 0,
      passingYear: 2026,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      status: 'Seeking',
      placedCompany: null,
      placedPackage: null,
      headline: `${department} (${branchCode}) • Engineering Candidate`,
      location: 'Campus / Accredited Candidate',
      projects: [],
      certifications: [],
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 500)}?w=150&auto=format&fit=crop&q=80`
    });

    onClose();
  };

  const handleDeptChange = (dept) => {
    setDepartment(dept);
    if (dept.includes('Computer')) setBranchCode('CSE');
    else if (dept.includes('Information')) setBranchCode('IT');
    else if (dept.includes('Electronics')) setBranchCode('ECE');
    else if (dept.includes('Mechanical')) setBranchCode('MECH');
    else if (dept.includes('Civil')) setBranchCode('CIVIL');
    else setBranchCode('OTHER');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border-2 border-indigo-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        <div className="p-7 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">Enroll New Student</h3>
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 border border-indigo-300">
                  Candidate Enrollment
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Add verified candidate to campus placement database</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5 text-sm sm:text-base">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aditi Rao"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Roll / Reg Number *</label>
              <input
                type="text"
                required
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="2022CS1099"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aditi.rao@campus.edu"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 12345"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Department</label>
              <select
                value={department}
                onChange={(e) => handleDeptChange(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm sm:text-base"
              >
                <option value="Computer Science & Engineering">Computer Science (CSE)</option>
                <option value="Information Technology">Information Technology (IT)</option>
                <option value="Electronics & Communication">Electronics & Comm (ECE)</option>
                <option value="Mechanical Engineering">Mechanical (MECH)</option>
                <option value="Civil Engineering">Civil (CIVIL)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Branch Code</label>
              <input
                type="text"
                readOnly
                value={branchCode}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Cumulative CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Active Backlogs</label>
              <input
                type="number"
                min="0"
                max="10"
                value={backlogs}
                onChange={(e) => setBacklogs(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm sm:text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Skills (comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              placeholder="Java, Python, React, Cloud"
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
              className="px-8 py-3 rounded-2xl bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white font-black text-sm sm:text-base shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Register Candidate
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
