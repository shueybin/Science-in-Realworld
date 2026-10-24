import { OrganizationLicense } from '../types';

export const INITIAL_ORGANIZATIONS: OrganizationLicense[] = [
  {
    id: "org-oakridge",
    name: "Oakridge STEM High School",
    type: "school",
    tier: "starter_25",
    licenseKey: "EDU-OAKRIDGE-2026",
    allowedDomain: "oakridge.k12.us",
    adminEmail: "dr.vance@oakridge.k12.us",
    totalSeats: 50,
    usedSeats: 38,
    createdAt: "2026-01-15T08:00:00Z",
    expiresAt: "2027-06-30T23:59:59Z",
    status: "active",
    members: [
      {
        id: "mem-1",
        name: "Dr. Sarah Vance",
        email: "dr.vance@oakridge.k12.us",
        role: "teacher",
        joinedAt: "2026-01-15T08:30:00Z",
        quizzesCompleted: 14,
        lastScore: 100,
        bookmarkedElements: [6, 26, 79, 92]
      },
      {
        id: "mem-2",
        name: "Maya Lin (Class 10-A)",
        email: "maya.lin@oakridge.k12.us",
        role: "student",
        joinedAt: "2026-01-20T10:15:00Z",
        quizzesCompleted: 11,
        lastScore: 92,
        bookmarkedElements: [3, 14, 29, 47]
      },
      {
        id: "mem-3",
        name: "Ethan Chen",
        email: "ethan.c@oakridge.k12.us",
        role: "student",
        joinedAt: "2026-01-22T14:00:00Z",
        quizzesCompleted: 8,
        lastScore: 88,
        bookmarkedElements: [1, 8, 17, 35]
      },
      {
        id: "mem-4",
        name: "Sophia Rodriguez",
        email: "sophia.r@oakridge.k12.us",
        role: "student",
        joinedAt: "2026-02-01T09:45:00Z",
        quizzesCompleted: 16,
        lastScore: 96,
        bookmarkedElements: [2, 10, 18, 36, 54]
      }
    ]
  },
  {
    id: "org-pacific",
    name: "Pacific Institute of Technology (Chemistry Dept)",
    type: "university",
    tier: "campus_500",
    licenseKey: "EDU-PACIFIC-CHEM",
    allowedDomain: "pacific.edu",
    adminEmail: "chemistry-head@pacific.edu",
    totalSeats: 500,
    usedSeats: 324,
    createdAt: "2026-02-01T00:00:00Z",
    expiresAt: "2027-08-31T23:59:59Z",
    status: "active",
    members: [
      {
        id: "mem-pac-1",
        name: "Prof. Kenneth Meyer",
        email: "kmeyer@pacific.edu",
        role: "teacher",
        joinedAt: "2026-02-01T09:00:00Z",
        quizzesCompleted: 20,
        lastScore: 100,
        bookmarkedElements: [57, 58, 64, 74, 78]
      },
      {
        id: "mem-pac-2",
        name: "Liam O'Connor (Lab TA)",
        email: "liam.oc@pacific.edu",
        role: "researcher",
        joinedAt: "2026-02-05T11:20:00Z",
        quizzesCompleted: 18,
        lastScore: 98,
        bookmarkedElements: [41, 42, 45, 46, 75]
      }
    ]
  },
  {
    id: "org-aero",
    name: "AeroAlloys Aerospace & Defense Materials",
    type: "company",
    tier: "standard_100",
    licenseKey: "CORP-AEROALLOYS-88",
    allowedDomain: "aeroalloys.corp",
    adminEmail: "materials-licensing@aeroalloys.corp",
    totalSeats: 100,
    usedSeats: 54,
    createdAt: "2026-01-10T12:00:00Z",
    expiresAt: "2027-01-10T23:59:59Z",
    status: "active",
    members: [
      {
        id: "mem-aero-1",
        name: "Elena Rostova (Lead Metallurgist)",
        email: "e.rostova@aeroalloys.corp",
        role: "employee",
        joinedAt: "2026-01-11T09:30:00Z",
        quizzesCompleted: 9,
        lastScore: 95,
        bookmarkedElements: [22, 23, 73, 74, 75]
      }
    ]
  }
];
