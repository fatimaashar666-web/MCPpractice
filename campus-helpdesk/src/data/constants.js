export const STATUSES = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
};

export const STATUS_LIST = [
  STATUSES.PENDING,
  STATUSES.IN_PROGRESS,
  STATUSES.RESOLVED,
];

export const CATEGORIES = [
  'IT & Wi-Fi',
  'Facilities & Maintenance',
  'Academic & Registrar',
  'Library & Computer Labs',
  'Campus Security & Safety',
  'Cafeteria & Dining',
  'Other / General',
];

export const PRIORITIES = [
  'Low',
  'Medium',
  'High',
  'Urgent',
];

export const STATUS_META = {
  [STATUSES.PENDING]: {
    label: 'Pending',
    color: '#d97706',
    bgColor: '#fef3c7',
    borderColor: '#fde68a',
    badgeClass: 'badge-pending',
    description: 'Submitted and awaiting assignment or review',
  },
  [STATUSES.IN_PROGRESS]: {
    label: 'In Progress',
    color: '#2563eb',
    bgColor: '#dbeafe',
    borderColor: '#bfdbfe',
    badgeClass: 'badge-in-progress',
    description: 'Technician/staff is actively investigating or fixing',
  },
  [STATUSES.RESOLVED]: {
    label: 'Resolved',
    color: '#059669',
    bgColor: '#d1fae5',
    borderColor: '#a7f3d0',
    badgeClass: 'badge-resolved',
    description: 'Issue has been completed, tested, and resolved',
  },
};

export const PRIORITY_META = {
  Low: {
    color: '#475569',
    bgColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },
  Medium: {
    color: '#0284c7',
    bgColor: '#e0f2fe',
    borderColor: '#bae6fd',
  },
  High: {
    color: '#ea580c',
    bgColor: '#ffedd5',
    borderColor: '#fed7aa',
  },
  Urgent: {
    color: '#dc2626',
    bgColor: '#fee2e2',
    borderColor: '#fecaca',
  },
};

export const INITIAL_TICKETS = [
  {
    id: 'TCK-1001',
    title: 'Wi-Fi connection failing in West Hall 3rd Floor',
    category: 'IT & Wi-Fi',
    priority: 'High',
    status: STATUSES.IN_PROGRESS,
    submitterName: 'Sarah Jenkins',
    submitterEmail: 's.jenkins@campus.edu',
    studentId: 'STU-48291',
    location: 'West Residence Hall, 3rd Floor Study Lounge',
    description: 'The Wi-Fi access point in the study lounge drops connections every 5 minutes. Multiple students working on assignments are unable to stay connected to campus portal.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    adminNote: 'Network team replaced AP unit; currently monitoring signal stability.',
    history: [
      {
        status: STATUSES.PENDING,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        note: 'Ticket created by Sarah Jenkins',
      },
      {
        status: STATUSES.IN_PROGRESS,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        note: 'Assigned to Network Operations (Tech: Mike R.)',
      },
    ],
  },
  {
    id: 'TCK-1002',
    title: 'Chemistry Lab 204 Overhead Projector Bulb Blown',
    category: 'Facilities & Maintenance',
    priority: 'Urgent',
    status: STATUSES.PENDING,
    submitterName: 'Dr. Robert Martinez',
    submitterEmail: 'r.martinez@campus.edu',
    studentId: 'FAC-10492',
    location: 'Science Building, Room 204',
    description: 'Overhead projector bulb burned out mid-lecture. Need replacement before tomorrow morning 9:00 AM general chemistry session with 120 students.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    adminNote: '',
    history: [
      {
        status: STATUSES.PENDING,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        note: 'Ticket created by Dr. Robert Martinez',
      },
    ],
  },
  {
    id: 'TCK-1003',
    title: 'Dorm Room 112 radiator leaking small puddle',
    category: 'Facilities & Maintenance',
    priority: 'Medium',
    status: STATUSES.RESOLVED,
    submitterName: 'Marcus Chen',
    submitterEmail: 'm.chen@campus.edu',
    studentId: 'STU-63821',
    location: 'East Hall, Room 112',
    description: 'The heating valve on the radiator began dripping onto the floor. Placed a bucket beneath it.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    adminNote: 'Maintenance replaced the pressure valve gasket and confirmed no further leakage.',
    history: [
      {
        status: STATUSES.PENDING,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        note: 'Ticket created by Marcus Chen',
      },
      {
        status: STATUSES.IN_PROGRESS,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        note: 'Plumbing technician dispatched',
      },
      {
        status: STATUSES.RESOLVED,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        note: 'Gasket replaced and verified intact',
      },
    ],
  },
  {
    id: 'TCK-1004',
    title: 'Student ID card NFC reader not working at Central Library entrance',
    category: 'Library & Computer Labs',
    priority: 'Medium',
    status: STATUSES.RESOLVED,
    submitterName: 'Emily Taylor',
    submitterEmail: 'e.taylor@campus.edu',
    studentId: 'STU-33201',
    location: 'Central Library, Turnstile Gate 3',
    description: 'Turnstile 3 fails to scan student ID cards, creating a backup during peak morning hours.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
    adminNote: 'RFID scanner recalibrated and firmware updated.',
    history: [
      {
        status: STATUSES.PENDING,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
        note: 'Ticket submitted',
      },
      {
        status: STATUSES.RESOLVED,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
        note: 'Turnstile RFID firmware updated',
      },
    ],
  },
  {
    id: 'TCK-1005',
    title: 'Course registration portal throws 500 error on section 4B',
    category: 'Academic & Registrar',
    priority: 'Urgent',
    status: STATUSES.IN_PROGRESS,
    submitterName: 'Liam O’Connor',
    submitterEmail: 'l.oconnor@campus.edu',
    studentId: 'STU-88219',
    location: 'Online Student Portal',
    description: 'When trying to enroll in CS-301 Section 4B, the server returns "Internal Server Error 500". Prerequisite check seems misconfigured for transfer students.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    adminNote: 'Registrar systems engineer reviewing database constraints for CS-301.',
    history: [
      {
        status: STATUSES.PENDING,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        note: 'Ticket submitted',
      },
      {
        status: STATUSES.IN_PROGRESS,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        note: 'Database administrator escalated',
      },
    ],
  },
  {
    id: 'TCK-1006',
    title: 'Cafeteria refrigerated drink dispenser overheating',
    category: 'Cafeteria & Dining',
    priority: 'Low',
    status: STATUSES.PENDING,
    submitterName: 'Hannah Patel',
    submitterEmail: 'h.patel@campus.edu',
    studentId: 'STU-55412',
    location: 'North Quad Dining Hall',
    description: 'The fountain dispenser on the south counter feels noticeably warm to touch and beverages are not coming out chilled.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    adminNote: '',
    history: [
      {
        status: STATUSES.PENDING,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        note: 'Ticket created',
      },
    ],
  },
];

