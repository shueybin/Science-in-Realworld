export interface ElementCategory {
  label: string;
  color: string;
  desc: string;
}

export type CategoryKey = 'am' | 'ae' | 'tm' | 'pm' | 'md' | 'nm' | 'hg' | 'ng' | 'ln' | 'ac';

export type StateOfMatter = 'solid' | 'liquid' | 'gas' | 'synthetic';

export interface ChemicalElement {
  z: number;            // Atomic number
  s: string;            // Symbol
  n: string;            // Name
  cat: CategoryKey;     // Category code
  r: number;            // Row (period)
  c: number;            // Column (group)
  i: string;            // Emoji / Icon
  u: string;            // Everyday real-world use summary
  d?: string;           // Detailed description
  weight?: string;      // Standard atomic weight
  state?: StateOfMatter;
  shells?: number[];    // Electron configuration by shell [K, L, M, N, O, P, Q]
  discovered?: string;  // Year or antiquity
}

export type OrganizationType = 'school' | 'university' | 'company' | 'research_lab';

export type LicenseTier = 'starter_25' | 'standard_100' | 'campus_500' | 'enterprise_unlimited';

export interface MemberUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'employee' | 'admin' | 'researcher';
  joinedAt: string;
  quizzesCompleted: number;
  lastScore: number;
  bookmarkedElements: number[];
}

export interface OrganizationLicense {
  id: string;
  name: string;
  type: OrganizationType;
  tier: LicenseTier;
  licenseKey: string;
  allowedDomain?: string; // e.g. "mit.edu" or "spacex.com"
  adminEmail: string;
  totalSeats: number;
  usedSeats: number;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'trial';
  members: MemberUser[];
}

export interface CurrentUserSession {
  isLoggedIn: boolean;
  user?: MemberUser;
  organization?: OrganizationLicense;
}
