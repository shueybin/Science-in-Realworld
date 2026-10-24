import React, { useState } from 'react';
import { useLicense } from '../context/LicenseContext';
import { OrganizationType, LicenseTier, MemberUser } from '../types';
import {
  Building2,
  GraduationCap,
  KeyRound,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Trash2,
  UserCheck,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  School
} from 'lucide-react';

export const LicensePortal: React.FC = () => {
  const {
    organizations,
    activeOrg,
    currentUser,
    isLicensed,
    registerOrganization,
    activateLicenseKey,
    joinByDomain,
    selectActiveOrg,
    revokeMember,
    logoutLicense
  } = useLicense();

  const [activeTab, setActiveTab] = useState<'status' | 'register' | 'join' | 'admin'>('status');

  // Form states for new organization registration
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgType, setNewOrgType] = useState<OrganizationType>('school');
  const [newOrgTier, setNewOrgTier] = useState<LicenseTier>('standard_100');
  const [newOrgAdminEmail, setNewOrgAdminEmail] = useState('');
  const [newOrgDomain, setNewOrgDomain] = useState('');
  const [customKey, setCustomKey] = useState('');

  // Form states for member activation
  const [joinKey, setJoinKey] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [joinRole, setJoinRole] = useState<MemberUser['role']>('student');

  // Notification banners
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim() || !newOrgAdminEmail.trim()) {
      showToast('Please provide an organization name and admin email.', true);
      return;
    }

    const res = registerOrganization({
      name: newOrgName.trim(),
      type: newOrgType,
      tier: newOrgTier,
      adminEmail: newOrgAdminEmail.trim(),
      allowedDomain: newOrgDomain.trim() || undefined,
      customKey: customKey.trim() || undefined
    });

    if (res.success) {
      showToast(res.message);
      setActiveTab('status');
      setNewOrgName('');
      setNewOrgAdminEmail('');
      setNewOrgDomain('');
      setCustomKey('');
    } else {
      showToast(res.message, true);
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinEmail.trim() || !joinName.trim()) {
      showToast('Please provide your name and institutional email.', true);
      return;
    }

    let res;
    if (joinKey.trim()) {
      res = activateLicenseKey(joinKey.trim(), {
        name: joinName.trim(),
        email: joinEmail.trim(),
        role: joinRole
      });
    } else {
      res = joinByDomain({
        name: joinName.trim(),
        email: joinEmail.trim(),
        role: joinRole
      });
    }

    if (res.success) {
      showToast(res.message);
      setActiveTab('status');
      setJoinKey('');
    } else {
      showToast(res.message, true);
    }
  };

  const handleCopyInviteLink = async () => {
    if (!activeOrg) return;
    try {
      const inviteUrl = `${window.location.origin}${window.location.pathname}?license=${activeOrg.licenseKey}`;
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      showToast(`Direct join link copied for ${activeOrg.name}!`);
    } catch (_) {}
  };

  const handleExportRosterCSV = () => {
    if (!activeOrg) return;
    const header = 'Member Name,Email,Role,Quizzes Completed,Last Score,Joined Date\n';
    const rows = activeOrg.members
      .map(
        m =>
          `"${m.name}","${m.email}","${m.role}",${m.quizzesCompleted},${m.lastScore}%,"${m.joinedAt}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeOrg.name.replace(/\s+/g, '_')}_License_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported roster CSV successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 py-2">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-in slide-in-from-top-2 shadow-sm ${
            toastMessage.isError
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-800'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
          }`}
        >
          {toastMessage.isError ? (
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Hero Banner: B2B School & Enterprise Licensing */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            B2B Group Licensing & Android Deployment
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
            Institutional License Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Provision group access for schools, universities, and corporate research labs. Distribute licenses to hundreds of students or employees with automatic domain matching and 100% offline chemistry lab access.
          </p>
        </div>

        {/* Quick Org Switcher Pills */}
        <div className="relative z-10 mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex-shrink-0">
            Switch Demo Org:
          </span>
          {organizations.map(org => {
            const isSelected = activeOrg?.id === org.id;
            return (
              <button
                key={org.id}
                onClick={() => selectActiveOrg(org.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500 text-white font-semibold shadow-sm'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {org.type === 'school' ? <School className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                {org.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('status')}
          className={`py-2 px-3 rounded-xl text-xs font-heading font-semibold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'status'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
          Active License Status
        </button>

        <button
          onClick={() => setActiveTab('join')}
          className={`py-2 px-3 rounded-xl text-xs font-heading font-semibold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'join'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 text-amber-500" />
          Join as Student / Employee
        </button>

        <button
          onClick={() => setActiveTab('admin')}
          className={`py-2 px-3 rounded-xl text-xs font-heading font-semibold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'admin'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-blue-500" />
          Institution Roster & Seats
        </button>

        <button
          onClick={() => setActiveTab('register')}
          className={`py-2 px-3 rounded-xl text-xs font-heading font-semibold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'register'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5 text-cyan-500" />
          Register New Org
        </button>
      </div>

      {/* Tab 1: Current License Status */}
      {activeTab === 'status' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Institution Card */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  ACTIVE GROUP LICENSE
                </span>
                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white mt-0.5">
                  {activeOrg?.name || 'No Organization Selected'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
                  Tier: {activeOrg?.tier.replace('_', ' ')} · Type: {activeOrg?.type}
                </p>
              </div>

              <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                {activeOrg?.status || 'Active'}
              </div>
            </div>

            {/* License Key & Share Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  Institutional License Key
                </div>
                <div className="text-base font-mono font-bold text-slate-900 dark:text-slate-100 tracking-wider">
                  {activeOrg?.licenseKey}
                </div>
                {activeOrg?.allowedDomain && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Domain auto-join: <strong>@{activeOrg.allowedDomain}</strong>
                  </div>
                )}
              </div>

              <button
                onClick={handleCopyInviteLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Copy Student Invite Link'}</span>
              </button>
            </div>

            {/* Seat Usage Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                <span>Seat Utilization:</span>
                <span className="font-mono font-bold">
                  {activeOrg?.usedSeats} / {activeOrg?.totalSeats} Seats Filled (
                  {Math.round(((activeOrg?.usedSeats || 0) / (activeOrg?.totalSeats || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(((activeOrg?.usedSeats || 0) / (activeOrg?.totalSeats || 1)) * 100)
                    )}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>
                  {(activeOrg?.totalSeats || 0) - (activeOrg?.usedSeats || 0)} available seats for new students/employees
                </span>
                <span>Renewal: {new Date(activeOrg?.expiresAt || '').toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                CURRENT DEVICE SEAT
              </span>
              <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white mt-1">
                {currentUser?.name || 'Guest User'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {currentUser?.email || 'No email attached'}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Role: {currentUser?.role || 'Guest'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Quizzes Passed:</span>
                <strong className="font-mono">{currentUser?.quizzesCompleted || 0}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Average Grade:</span>
                <strong className="font-mono text-emerald-600 dark:text-emerald-400">
                  {currentUser?.lastScore ? `${currentUser.lastScore}%` : '—'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bookmarked Elements:</span>
                <strong className="font-mono">{currentUser?.bookmarkedElements.length || 0}</strong>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={logoutLicense}
                className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:border-rose-300 text-xs font-medium transition"
              >
                Sign Out of Device Seat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Join as Student or Employee */}
      {activeTab === 'join' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm max-w-xl mx-auto space-y-5">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              Activate Student or Employee License
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your school or company license key, or your institutional email address to claim an assigned seat.
            </p>
          </div>

          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={joinName}
                onChange={e => setJoinName(e.target.value)}
                placeholder="e.g. Jordan Miller"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                required
                value={joinEmail}
                onChange={e => setJoinEmail(e.target.value)}
                placeholder="e.g. jmiller@oakridge.k12.us"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: If your institution configured auto-join, your email domain is detected automatically.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                License Key (Optional if domain configured)
              </label>
              <input
                type="text"
                value={joinKey}
                onChange={e => setJoinKey(e.target.value)}
                placeholder="e.g. EDU-OAKRIDGE-2026 or CORP-AEROALLOYS-88"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Role
              </label>
              <select
                value={joinRole}
                onChange={e => setJoinRole(e.target.value as MemberUser['role'])}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="student">Student (K-12 / Undergraduate)</option>
                <option value="teacher">Teacher / Professor / Lab Head</option>
                <option value="employee">Corporate Employee / Engineer</option>
                <option value="researcher">Materials Scientist / Researcher</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-heading font-semibold text-sm transition shadow-md"
            >
              Verify & Claim Institutional Seat
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Institution Roster & Seats (Admin) */}
      {activeTab === 'admin' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                Member Roster: {activeOrg?.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeOrg?.members.length} active seats assigned · {activeOrg?.totalSeats} total capacity
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportRosterCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Roster Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                <tr>
                  <th className="p-3">Member</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Quizzes</th>
                  <th className="p-3">Last Score</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeOrg?.members.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{member.name}</div>
                      <div className="text-slate-400 text-[11px] font-mono">{member.email}</div>
                    </td>
                    <td className="p-3">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {member.role}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-medium">{member.quizzesCompleted}</td>
                    <td className="p-3">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {member.lastScore}%
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      {member.role !== 'admin' && (
                        <button
                          onClick={() => activeOrg && revokeMember(activeOrg.id, member.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Revoke seat for new student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Register New Organization */}
      {activeTab === 'register' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm max-w-xl mx-auto space-y-5">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              Register New School or Company License
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create a custom license pool for your educational institution or enterprise chemistry team.
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institution / Company Name
              </label>
              <input
                type="text"
                required
                value={newOrgName}
                onChange={e => setNewOrgName(e.target.value)}
                placeholder="e.g. Stanford Department of Chemical Engineering"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Organization Type
                </label>
                <select
                  value={newOrgType}
                  onChange={e => setNewOrgType(e.target.value as OrganizationType)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="school">K-12 School</option>
                  <option value="university">University / College</option>
                  <option value="company">Enterprise / Corporation</option>
                  <option value="research_lab">Research Laboratory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Seat Tier
                </label>
                <select
                  value={newOrgTier}
                  onChange={e => setNewOrgTier(e.target.value as LicenseTier)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="starter_25">Starter (50 Seats)</option>
                  <option value="standard_100">Standard (100 Seats)</option>
                  <option value="campus_500">Campus (500 Seats)</option>
                  <option value="enterprise_unlimited">Enterprise (5,000 Seats)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={newOrgAdminEmail}
                onChange={e => setNewOrgAdminEmail(e.target.value)}
                placeholder="e.g. admin@stanford.edu"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Authorized Domain (Optional auto-join)
              </label>
              <input
                type="text"
                value={newOrgDomain}
                onChange={e => setNewOrgDomain(e.target.value)}
                placeholder="e.g. stanford.edu (anyone with this domain joins automatically)"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Custom License Key (Leave empty to auto-generate)
              </label>
              <input
                type="text"
                value={customKey}
                onChange={e => setCustomKey(e.target.value)}
                placeholder="e.g. EDU-STANFORD-CHEM101"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-heading font-semibold text-sm hover:opacity-95 transition shadow-md"
            >
              Generate Group License & Activate
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
