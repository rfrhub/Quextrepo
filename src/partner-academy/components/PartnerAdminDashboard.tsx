import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { COURSE_MODULES } from '../data/mockData';
import { Building2, Users, Award, ShieldCheck, CheckCircle2, UserPlus, Download, Search, Filter, ExternalLink } from 'lucide-react';

interface PartnerAdminDashboardProps {
  onViewCertForUser: (userId: string) => void;
}

export const PartnerAdminDashboard: React.FC<PartnerAdminDashboardProps> = ({
  onViewCertForUser,
}) => {
  const { currentCompany, companyUsers, addTechnician, currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'certified' | 'in_progress'>('all');
  const [showAddTechModal, setShowAddTechModal] = useState(false);

  // New Tech form state
  const [newTechName, setNewTechName] = useState('');
  const [newTechEmail, setNewTechEmail] = useState('');
  const [newTechId, setNewTechId] = useState('');

  const totalTechs = companyUsers.length;
  const certifiedTechs = companyUsers.filter((u) => u.certifications.length > 0);
  const certifiedPercentage = Math.round((certifiedTechs.length / (totalTechs || 1)) * 100);

  // Filtered list
  const filteredUsers = companyUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.fieldIdNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const isCertified = u.certifications.length > 0;
    if (filterStatus === 'certified') return matchesSearch && isCertified;
    if (filterStatus === 'in_progress') return matchesSearch && !isCertified;
    return matchesSearch;
  });

  const handleCreateTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTechName || !newTechEmail) return;

    addTechnician({
      name: newTechName,
      email: newTechEmail,
      fieldIdNumber: newTechId || `TECH-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    setNewTechName('');
    setNewTechEmail('');
    setNewTechId('');
    setShowAddTechModal(false);
  };

  const handleExportRosterCsv = () => {
    const headers = ['Name', 'Email', 'Field ID', 'Role', 'Company', 'Certified', 'Cert ID', 'Avg Score'];
    const rows = companyUsers.map((u) => {
      const scores = Object.values(u.quizScores);
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 'N/A';
      return [
        `"${u.name}"`,
        `"${u.email}"`,
        `"${u.fieldIdNumber}"`,
        `"${u.role}"`,
        `"${u.companyName}"`,
        `"${u.certifications.length > 0 ? 'Yes' : 'No'}"`,
        `"${u.certifications[0] || 'None'}"`,
        `"${avg}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentCompany.code}_Technician_Compliance_Audit.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Company Card */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span className="text-cyan-400 font-semibold">{currentCompany.tier}</span>
                <span aria-hidden="true">·</span>
                <span>Region: {currentCompany.region}</span>
                <span aria-hidden="true">·</span>
                <span>Code: {currentCompany.code}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-white mt-1">
                {currentCompany.name}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Partner Training &amp; Field Accreditation Dashboard · Logged in as{' '}
                <strong className="text-slate-200">{currentUser.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddTechModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Technician</span>
            </button>
            <button
              onClick={handleExportRosterCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Audit CSV</span>
            </button>
          </div>
        </div>

        {/* Company Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Field Techs</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono mt-1 tabular-nums">
              {totalTechs}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Active in company portal</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Certified Installers</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1 tabular-nums">
              {certifiedTechs.length}
            </div>
            <div className="text-[11px] text-emerald-500/80 mt-1">Passed 100% of exams</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Certification Rate</span>
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-extrabold text-cyan-300 font-mono mt-1 tabular-nums">
              {certifiedPercentage}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Tier benchmark: 80%</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>OEM Partner Standing</span>
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-sm font-extrabold text-white mt-2">
              Quext Gold Approved
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Renewed for 2026-2027</div>
          </div>
        </div>
      </div>

      {/* Technician Roster Table */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Technician Training Progress Roster</h2>
            <p className="text-xs text-slate-400">
              Real-time module completions and verifiable certificate downloads for field staff.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search technician..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Techs</option>
              <option value="certified">Certified Only</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Technician</th>
                <th className="py-3 px-3">Field ID</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Curriculum Progress</th>
                <th className="py-3 px-3">Exam Average</th>
                <th className="py-3 px-3">Credential</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.map((tech) => {
                const isCertified = tech.certifications.length > 0;
                const scores = Object.values(tech.quizScores);
                const avgScore =
                  scores.length > 0
                    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                    : null;

                const completedCount = COURSE_MODULES.filter(
                  (m) => tech.quizScores[m.id] !== undefined && tech.quizScores[m.id] >= 80
                ).length;

                return (
                  <tr key={tech.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-sm">{tech.name}</div>
                      <div className="text-[11px] text-slate-400">{tech.email}</div>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-semibold text-slate-300">
                      {tech.fieldIdNumber}
                    </td>

                    <td className="py-3.5 px-3 text-slate-400 capitalize">
                      {tech.role === 'partner_installer' ? 'Field Installer' : 'Partner Admin'}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-300 font-medium">
                          {completedCount} of {COURSE_MODULES.length} Passed
                        </span>
                        <span className="font-mono text-cyan-400 font-bold tabular-nums">
                          {Math.round((completedCount / COURSE_MODULES.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                          style={{
                            width: `${(completedCount / COURSE_MODULES.length) * 100}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold">
                      {avgScore !== null ? (
                        <span
                          className={avgScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}
                        >
                          {avgScore}%
                        </span>
                      ) : (
                        <span className="text-slate-500 font-normal">Pending</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      {isCertified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Certified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                          In Training
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => onViewCertForUser(tech.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Certificate</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Technician Modal */}
      {showAddTechModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white">Enroll New Field Technician</h3>
            <p className="text-xs text-slate-400 mt-1">
              Add a new installer to <strong className="text-slate-200">{currentCompany.name}</strong>. They will receive curriculum access immediately.
            </p>

            <form onSubmit={handleCreateTech} className="mt-4 space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Technician Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Mitchell"
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Company Email</label>
                <input
                  type="email"
                  required
                  placeholder="jordan.m@company.com"
                  value={newTechEmail}
                  onChange={(e) => setNewTechEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  Field ID Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="TECH-XXXX"
                  value={newTechId}
                  onChange={(e) => setNewTechId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTechModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors"
                >
                  Enroll Technician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
