# 🎓 Campus Helpdesk Portal

A responsive, feature-rich web application built with **React** and **Vite** designed for university campuses. It provides a seamless support and issue management portal for students, faculty, residential halls, and facilities staff, featuring full **localStorage** persistence, real-time ticket lifecycle management, and an **Admin Dashboard** with analytics.

---

## ✨ Features

### 1. 📝 Issue Submission Form
- **Input Fields & Validation**:
  - Full Name & Campus Email (with format validation)
  - Student / Employee ID (e.g. `STU-48291` / `FAC-10492`)
  - Campus Location / Building / Room (e.g. *Science Block Room 204*, *East Residence Hall*)
  - Category Selection (`IT & Wi-Fi`, `Facilities & Maintenance`, `Academic & Registrar`, `Library & Computer Labs`, `Campus Security & Safety`, `Cafeteria & Dining`, `Other / General`)
  - Urgency / Priority Selector (`Low`, `Medium`, `High`, `Urgent`) with color-coded pills
  - Issue Subject & Detailed Description (with minimum length requirements)
- **Interactive Quick-Fill**:
  - "Auto-fill Sample Issue" button for testing without manual typing.
- **Immediate Feedback**:
  - Generates unique ticket ID (e.g. `TCK-1001`) and assigns initial status **Pending**.
  - Animated toast notification confirming submission.
  - Automatically redirects to the issue tracker to review the newly created ticket.

---

### 2. 🔄 Ticket Lifecycle & Status Tracking
Every issue progresses through three explicit status stages:
1. **Pending** *(Amber)*: Issue submitted and waiting for department triage or assignment.
2. **In Progress** *(Blue)*: Technicians or campus staff are actively investigating and servicing the request.
3. **Resolved** *(Emerald)*: Issue is completed, verified, and signed off.

- **3-Step Visual Progress Tracker**: Displayed directly on each ticket card.
- **Activity & Status History Audit**: Tracks each timestamped transition and technician notes.

---

### 3. 🔍 Public Issue Tracker (Student & Faculty View)
- Real-time search across ticket IDs, subjects, submitter names, rooms, and descriptions.
- Quick filter tabs by status (`All`, `Pending`, `In Progress`, `Resolved`) with live count badges.
- Category filters and sorting (Newest first, Oldest first, Highest priority).
- Detailed modal popup showing complete ticket metadata, staff notes, and history timeline.
- One-click "Copy Ticket ID" for reference.

---

### 4. 📊 Admin Dashboard & Statistics
- **Top-Level KPI Metrics**:
  - **Total Tickets**
  - **Pending Queue**
  - **In Progress Queue**
  - **Resolved Tickets**
  - **Resolution Rate (%)**
  - **High & Urgent Priority Alerts**
- **Visual Analytics**:
  - **Issue Breakdown by Category**: Visual percentage bars per department.
  - **Priority Distribution**: Low, Medium, High, Urgent breakdown.
  - **Composite Pipeline Bar**: Real-time ratio of Pending vs. In Progress vs. Resolved.
- **Management Operations**:
  - **Inline Status Dropdown**: Change ticket status instantly between `Pending`, `In Progress`, and `Resolved`.
  - **Staff Resolution Notes**: Click to add or update diagnostic notes inline.
  - **Delete Ticket**: Individual ticket deletion with safety confirmation.
  - **Export to CSV**: Download spreadsheet of all tickets for reporting.
  - **Export to JSON**: Download raw JSON backup of tickets.
  - **Reset Sample Data**: Re-populate realistic sample tickets for testing.
  - **Clear All**: Purge tickets queue with confirmation dialog.

---

### 5. 💾 LocalStorage Persistence
- All tickets and updates are automatically saved to `localStorage` (`campus_helpdesk_tickets_v1`).
- Data persists across browser refreshes and tab reloads.
- Pre-loaded with realistic campus seed tickets (Wi-Fi dropouts, blown lab projectors, dorm radiator leaks, course portal 500 errors).

---

### 6. 📱 Responsive Modern Design
- Fully responsive across desktop, laptop, tablet, and mobile displays.
- High-contrast, clean campus design system using accessible CSS variables and smooth transitions.
- Zero bulky external CSS frameworks or icon libraries—clean, lightweight, pure SVG + CSS.

---

## 📂 Project Structure

```text
campus-helpdesk/
├── index.html                     # HTML entry point with metadata
├── package.json                   # Project scripts and dependencies
├── vite.config.js                 # Vite bundler configuration
├── eslint.config.js               # ESLint configuration
├── src/
│   ├── main.jsx                   # React root mounting
│   ├── App.jsx                    # Core application router & state manager
│   ├── App.css                    # Responsive component & layout styling
│   ├── index.css                  # CSS reset and design tokens
│   ├── data/
│   │   └── constants.js           # Statuses, categories, priorities, seed data
│   ├── utils/
│   │   └── storage.js             # LocalStorage helpers, export to CSV/JSON, IDs
│   └── components/
│       ├── Header.jsx             # Top branding and tab navigation
│       ├── IssueForm.jsx          # Validated issue submission form
│       ├── TicketList.jsx         # Searchable ticket tracker with status steps
│       ├── AdminDashboard.jsx     # Analytics, KPI metrics, management table
│       ├── TicketModal.jsx        # Detailed ticket view, history timeline & notes
│       └── Toast.jsx              # Floating notification toasts
```

---

## 🚀 Getting Started

### 1. Development Server
Run the local Vite development server:
```bash
npm run dev
```
Open your browser and navigate to the displayed local URL (typically `http://localhost:5173`).

### 2. Build for Production
Generate optimized, minified production assets in `dist/`:
```bash
npm run build
```

### 3. Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

### 4. Code Quality & Linting
Run ESLint to check for code standard conformance:
```bash
npm run lint
```

---

## 📄 License
MIT License. Created for University Campus Support Operations.
