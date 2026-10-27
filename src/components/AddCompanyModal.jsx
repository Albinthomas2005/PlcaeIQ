import React, { useState } from 'react';
import { Building2, X, Globe, Mail, MapPin, Award } from 'lucide-react';
import { usePlacement } from '../context/PlacementContext';

export const AddCompanyModal = ({ isOpen, onClose }) => {
  const { addCompany, showToast } = usePlacement();

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Technology & Software Engineering');
  const [website, setWebsite] = useState('https://');
  const [location, setLocation] = useState('Bengaluru / Hybrid');
  const [hrContact, setHrContact] = useState('');
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState('Tier 1 (Dream)');
  const [avgPackage, setAvgPackage] = useState('18.0 LPA');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      showToast('Please fill out company name and contact email.', 'error');
      return;
    }

    addCompany({
      name,
      industry,
      website,
      location,
      hrContact: hrContact || 'Talent Acquisition Team',
      email,
      tier,
      avgPackage,
      description: description || `${name} is an accredited corporate partner hiring from university campus.`,
      logo: `https://logo.clearbit.com/${name.toLowerCase().replace(/\s+/g, '')}.com`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border-2 border-emerald-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        <div className="p-7 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-['Outfit']">Register Recruiting Company</h3>
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300">
                  Enterprise Registry
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Add corporate partner to placement panel</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5 text-sm sm:text-base">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Company Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Oracle / Atlassian"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Company Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm sm:text-base"
              >
                <option value="Tier 1 (Dream)">Tier 1 (Dream - &gt; 18 LPA)</option>
                <option value="Tier 2 (Core)">Tier 2 (Core - 8 - 18 LPA)</option>
                <option value="Tier 3 (Mass)">Tier 3 (Mass / IT - &lt; 8 LPA)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Industry Sector</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Fintech, SaaS, Hardware"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Estimated Avg CTC</label>
              <input
                type="text"
                value={avgPackage}
                onChange={(e) => setAvgPackage(e.target.value)}
                placeholder="₹16.5 LPA"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">HR / TA Contact Person</label>
              <input
                type="text"
                value={hrContact}
                onChange={(e) => setHrContact(e.target.value)}
                placeholder="Ramesh Pillai (Head TA)"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Recruitment Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="campus@company.com"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Careers Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://company.com/careers"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Office Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bengaluru / Hyderabad"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm sm:text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-800 dark:text-slate-200 font-bold mb-1.5">Company Overview</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the corporate profile and recruitment goals..."
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
              className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Register Recruiter
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
