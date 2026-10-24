import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrganizationLicense, MemberUser, OrganizationType, LicenseTier } from '../types';
import { INITIAL_ORGANIZATIONS } from '../data/mockLicenses';

interface LicenseContextType {
  organizations: OrganizationLicense[];
  activeOrg: OrganizationLicense | null;
  currentUser: MemberUser | null;
  isLicensed: boolean;
  registerOrganization: (data: {
    name: string;
    type: OrganizationType;
    tier: LicenseTier;
    adminEmail: string;
    allowedDomain?: string;
    customKey?: string;
  }) => { success: boolean; license?: OrganizationLicense; message: string };
  activateLicenseKey: (
    key: string,
    userDetails: { name: string; email: string; role: MemberUser['role'] }
  ) => { success: boolean; message: string };
  joinByDomain: (
    userDetails: { name: string; email: string; role: MemberUser['role'] }
  ) => { success: boolean; message: string };
  selectActiveOrg: (orgId: string) => void;
  revokeMember: (orgId: string, memberId: string) => void;
  recordQuizScore: (score: number) => void;
  toggleBookmark: (elementZ: number) => void;
  logoutLicense: () => void;
}

const LicenseContext = createContext<LicenseContextType | undefined>(undefined);

const STORAGE_KEY_ORGS = 'science_realworld_orgs_v1';
const STORAGE_KEY_SESSION = 'science_realworld_session_v1';

export const LicenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<OrganizationLicense[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ORGS);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return INITIAL_ORGANIZATIONS;
  });

  const [activeOrg, setActiveOrg] = useState<OrganizationLicense | null>(() => {
    return organizations[0] || null;
  });

  const [currentUser, setCurrentUser] = useState<MemberUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SESSION);
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    // Default to the first teacher / student for instant great experience
    return organizations[0]?.members[0] || null;
  });

  // Persist organizations whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORGS, JSON.stringify(organizations));
    } catch (_) {}
  }, [organizations]);

  // Persist session whenever it changes
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    } catch (_) {}
  }, [currentUser]);

  const selectActiveOrg = (orgId: string) => {
    const found = organizations.find(o => o.id === orgId);
    if (found) {
      setActiveOrg(found);
      const existingUserInOrg = found.members.find(m => m.email === currentUser?.email);
      if (existingUserInOrg) {
        setCurrentUser(existingUserInOrg);
      }
    }
  };

  const registerOrganization = ({
    name,
    type,
    tier,
    adminEmail,
    allowedDomain,
    customKey
  }: {
    name: string;
    type: OrganizationType;
    tier: LicenseTier;
    adminEmail: string;
    allowedDomain?: string;
    customKey?: string;
  }) => {
    const tierSeats: Record<LicenseTier, number> = {
      starter_25: 50,
      standard_100: 100,
      campus_500: 500,
      enterprise_unlimited: 5000
    };

    const seats = tierSeats[tier] || 100;
    const cleanPrefix = type === 'school' || type === 'university' ? 'EDU' : 'CORP';
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const generatedKey = customKey?.trim() ? customKey.trim().toUpperCase() : `${cleanPrefix}-${cleanName}-${randomSuffix}`;

    // Admin member
    const adminMember: MemberUser = {
      id: `mem-${Date.now()}`,
      name: `Admin (${adminEmail.split('@')[0]})`,
      email: adminEmail,
      role: 'admin',
      joinedAt: new Date().toISOString(),
      quizzesCompleted: 0,
      lastScore: 0,
      bookmarkedElements: [1, 6, 8, 26]
    };

    const newOrg: OrganizationLicense = {
      id: `org-${Date.now()}`,
      name,
      type,
      tier,
      licenseKey: generatedKey,
      allowedDomain: allowedDomain ? allowedDomain.trim().toLowerCase().replace(/^@/, '') : undefined,
      adminEmail,
      totalSeats: seats,
      usedSeats: 1,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      members: [adminMember]
    };

    const updated = [newOrg, ...organizations];
    setOrganizations(updated);
    setActiveOrg(newOrg);
    setCurrentUser(adminMember);

    return {
      success: true,
      license: newOrg,
      message: `Organization "${name}" successfully registered with ${seats} seats! License Key: ${generatedKey}`
    };
  };

  const activateLicenseKey = (
    key: string,
    userDetails: { name: string; email: string; role: MemberUser['role'] }
  ) => {
    const cleanKey = key.trim().toUpperCase();
    const targetOrgIndex = organizations.findIndex(o => o.licenseKey.toUpperCase() === cleanKey);

    if (targetOrgIndex === -1) {
      return { success: false, message: `License key "${key}" was not found. Please verify with your school/company IT administrator.` };
    }

    const org = organizations[targetOrgIndex];

    // Check if user is already a member
    const existingMember = org.members.find(m => m.email.toLowerCase() === userDetails.email.toLowerCase());
    if (existingMember) {
      setActiveOrg(org);
      setCurrentUser(existingMember);
      return { success: true, message: `Welcome back to ${org.name}, ${existingMember.name}!` };
    }

    // Check seat capacity
    if (org.usedSeats >= org.totalSeats) {
      return {
        success: false,
        message: `License pool full! All ${org.totalSeats} seats for "${org.name}" have been allocated. Contact your administrator to increase seats.`
      };
    }

    // Create new member
    const newMember: MemberUser = {
      id: `mem-${Date.now()}`,
      name: userDetails.name.trim() || 'New Member',
      email: userDetails.email.trim(),
      role: userDetails.role,
      joinedAt: new Date().toISOString(),
      quizzesCompleted: 0,
      lastScore: 0,
      bookmarkedElements: []
    };

    const updatedOrg = {
      ...org,
      usedSeats: org.usedSeats + 1,
      members: [newMember, ...org.members]
    };

    const updatedOrgs = [...organizations];
    updatedOrgs[targetOrgIndex] = updatedOrg;

    setOrganizations(updatedOrgs);
    setActiveOrg(updatedOrg);
    setCurrentUser(newMember);

    return {
      success: true,
      message: `Successfully activated seat at "${org.name}". Seat allocated: ${updatedOrg.usedSeats}/${org.totalSeats}.`
    };
  };

  const joinByDomain = (userDetails: { name: string; email: string; role: MemberUser['role'] }) => {
    const emailParts = userDetails.email.toLowerCase().split('@');
    if (emailParts.length !== 2) {
      return { success: false, message: 'Invalid email address.' };
    }
    const domain = emailParts[1];

    const matchedOrg = organizations.find(o => o.allowedDomain && o.allowedDomain.toLowerCase() === domain);
    if (!matchedOrg) {
      return {
        success: false,
        message: `No active institutional license found for domain "@${domain}". Enter an explicit License Key instead.`
      };
    }

    return activateLicenseKey(matchedOrg.licenseKey, userDetails);
  };

  const revokeMember = (orgId: string, memberId: string) => {
    setOrganizations(prev =>
      prev.map(org => {
        if (org.id !== orgId) return org;
        const filtered = org.members.filter(m => m.id !== memberId);
        return {
          ...org,
          usedSeats: Math.max(0, filtered.length),
          members: filtered
        };
      })
    );
  };

  const recordQuizScore = (score: number) => {
    if (!currentUser || !activeOrg) return;
    const updatedUser = {
      ...currentUser,
      quizzesCompleted: currentUser.quizzesCompleted + 1,
      lastScore: score
    };
    setCurrentUser(updatedUser);

    setOrganizations(prev =>
      prev.map(org => {
        if (org.id !== activeOrg.id) return org;
        return {
          ...org,
          members: org.members.map(m => (m.id === currentUser.id ? updatedUser : m))
        };
      })
    );
  };

  const toggleBookmark = (elementZ: number) => {
    if (!currentUser || !activeOrg) return;
    const exists = currentUser.bookmarkedElements.includes(elementZ);
    const updatedBookmarks = exists
      ? currentUser.bookmarkedElements.filter(z => z !== elementZ)
      : [...currentUser.bookmarkedElements, elementZ];

    const updatedUser = {
      ...currentUser,
      bookmarkedElements: updatedBookmarks
    };
    setCurrentUser(updatedUser);

    setOrganizations(prev =>
      prev.map(org => {
        if (org.id !== activeOrg.id) return org;
        return {
          ...org,
          members: org.members.map(m => (m.id === currentUser.id ? updatedUser : m))
        };
      })
    );
  };

  const logoutLicense = () => {
    setCurrentUser(null);
  };

  return (
    <LicenseContext.Provider
      value={{
        organizations,
        activeOrg,
        currentUser,
        isLicensed: !!currentUser && !!activeOrg,
        registerOrganization,
        activateLicenseKey,
        joinByDomain,
        selectActiveOrg,
        revokeMember,
        recordQuizScore,
        toggleBookmark,
        logoutLicense
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
};

export const useLicense = () => {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error('useLicense must be used within a LicenseProvider');
  }
  return context;
};
