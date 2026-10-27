import React, { useState, useEffect } from 'react';
import { User, X, Check, Mail, Phone, BookOpen, Code, Save, Sparkles } from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { currentStudent, updateStudent, showToast, fireConfetti } = usePlacement();

  const [name, setName] = useState(currentStudent?.name || '');
  const [rollNo, setRollNo] = useState(currentStudent?.rollNo || '');
  const [phone, setPhone] = useState(currentStudent?.phone || '');
  const [cgpa, setCgpa] = useState(currentStudent?.cgpa ?? 0);
  const [backlogs, setBacklogs] = useState(currentStudent?.backlogs ?? 0);
  const [skills, setSkills] = useState(currentStudent?.skills?.join(', ') || '');
  const [github, setGithub] = useState(currentStudent?.github || '');
  const [linkedin, setLinkedin] = useState(currentStudent?.linkedin || '');

  useEffect(() => {
    if (isOpen && currentStudent) {
      setName(currentStudent.name || '');
      setRollNo(currentStudent.rollNo || '');
      setPhone(currentStudent.phone || '');
      setCgpa(currentStudent.cgpa ?? 0);
      setBacklogs(currentStudent.backlogs ?? 0);
      setSkills(currentStudent.skills?.join(', ') || '');
      setGithub(currentStudent.github || '');
      setLinkedin(currentStudent.linkedin || '');
    }
  }, [isOpen, currentStudent]);

  if (!isOpen || !currentStudent) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsList = skills.split(',').map(s => s.trim()).filter(Boolean);

    updateStudent(currentStudent.id, {
      name: name || currentStudent.name,
      rollNo: rollNo || currentStudent.rollNo,
      phone,
      cgpa: parseFloat(cgpa) || currentStudent.cgpa,
      backlogs: parseInt(backlogs, 10) || 0,
      skills: skillsList,
      github,
      linkedin
    });

    fireConfetti();
    showToast('Student academic dossier & technical profile updated successfully!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border-2 border-indigo-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">
                  Edit Student Dossier
                </h3>
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200 border border-indigo-300">
                  Live Sync
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Update candidate credentials, technical stack & profiles</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5 text-sm sm:text-base">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Candidate Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm sm:text-base focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Roll / Reg Number</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm sm:text-base focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">CGPA (0 - 10)</label>
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
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">
              Technical Skills & Tech Stack (comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Node.js, Python, AWS, Docker, System Design"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm sm:text-base"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">GitHub Profile URL</label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">LinkedIn Profile URL</label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm sm:text-base cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white font-black text-sm sm:text-base shadow-lg shadow-indigo-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-5 h-5" />
              <span>Save & Update Dossier</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
