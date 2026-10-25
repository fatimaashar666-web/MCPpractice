# 🎓 Campus Helpdesk & Operations Portal

A responsive, high-performance web application built with **React 19** and **Vite 8** for university campuses and educational institutions. It provides a unified support and facilities management portal for students, faculty, dormitories, and operations staff, featuring client-side persistence, real-time ticket lifecycle tracking, interactive analytics, and native **Google Antigravity Lifecycle Hooks**.

---

## 📋 Table of Contents
- [✨ Key Features](#-key-features)
- [📂 Project Architecture](#-project-architecture)
- [⚙️ Prerequisites & Setup](#-prerequisites--setup)
- [🚀 Usage Guide](#-usage-guide)
  - [1. Submitting a Ticket](#1-submitting-a-ticket)
  - [2. Tracking Ticket Status](#2-tracking-ticket-status)
  - [3. Admin Operations & Analytics](#3-admin-operations--analytics)
- [🛡️ Antigravity AI & Sandbox Integration](#-antigravity-ai--sandbox-integration)
- [📜 Available Scripts](#-available-scripts)
- [📄 License](#-license)

---

## ✨ Key Features

### 1. 📝 Student & Faculty Issue Submission
* **Input Validation**: Enforces full name, valid campus email (`@*.edu` / standard format), building location, subject line (≥ 5 chars), and detailed description (≥ 15 chars).
* **Urgency & Department Categorization**: Color-coded urgency pills (`Low`, `Medium`, `High`, `Urgent`) and 7 campus categories (*IT & Wi-Fi*, *Facilities & Maintenance*, *Academic & Registrar*, *Library & Labs*, *Campus Security*, *Cafeteria & Dining*, *General*).
* **Auto-Fill Testing Helper**: "Auto-fill Sample Issue" button generates instant test scenarios without manual typing.
* **Instant ID & Dispatch**: Generates a collision-resistant ticket ID (`TCK-XXXX`), assigns default status **Pending**, logs initial submission audit history, and displays an animated toast alert.

### 2. 🔍 Public Issue Tracker
* **Multi-Field Real-Time Search**: Search across Ticket ID, title, student ID, submitter name, email, location, and description safely guarded against null/undefined fields.
* **Filter Tabs & Badges**: Filter by lifecycle status (`All`, `Pending`, `In Progress`, `Resolved`) with live counter badges.
* **Sorting & Categorization**: Sort by newest, oldest, or highest priority.
* **3-Step Progress Indicator**: Visual progression track on every card showing current stage.
* **Detail Modal**: Opens full audit timeline, copyable ticket ID with asynchronous clipboard handling, and technician diagnostic notes.

### 3. 📊 Admin Dashboard & Department Analytics
* **Operational KPI Cards**: Live counters for Total, Pending Queue, In Progress, Resolved, Critical (High/Urgent), and Resolution Rate (%).
* **Department Category Breakdown**: Visual progress bars displaying percentage volume per category.
* **Composite Pipeline Bar**: Real-time ratio of Pending vs. In Progress vs. Resolved tickets.
* **Inline Status Management**: Change ticket status instantly via dropdowns.
* **Safe Diagnostic Note Editor**: Add or edit technician notes inline with dirty-checking prompts to prevent accidental overwrite of unsaved drafts.
* **Blob-Stream Export**: Download clean CSV and formatted JSON backups without URI truncation on `#` or special characters.
* **Seed Data Controls**: Restore default realistic campus tickets or purge queues with safety confirmation dialogs.

### 4. 💾 Robust Local Persistence
* Data automatically syncs to browser `localStorage` (`campus_helpdesk_tickets_v1` and `campus_helpdesk_theme_v1`).
* Resilient fallback and cloning routines prevent in-memory mutation of seed constants.
* Includes light and dark theme persistence with custom CSS variables.

---

## 📂 Project Architecture

```text
campus-helpdesk/
├── index.html                           # HTML5 entry point
├── package.json                         # Dependencies and npm scripts
├── vite.config.js                       # Vite 8 build and plugin configuration
├── eslint.config.js                     # ESLint flat configuration (React Hooks, Refresh)
├── .agents/                             # Google Antigravity Agent Configuration
│   ├── hooks.json                       # Lifecycle hook definitions & matchers
│   └── scripts/
│       ├── safety-guard.js              # PreToolUse: Blocks destructive terminal commands
│       ├── session-init.js              # SessionStart: Workspace environment initialization
│       └── pre-invocation-reminder.js   # PreInvocation: Ephemeral code quality reminder
├── public/
│   └── icons.svg                        # SVG symbol sprite
└── src/
    ├── main.jsx                         # React root bootstrap (<StrictMode>)
    ├── App.jsx                          # Central state coordinator, router & toast manager
    ├── App.css                          # Component styling & responsive grid layouts
    ├── index.css                        # Design tokens, themes (light/dark) & resets
    ├── data/
    │   └── constants.js                 # Categories, priorities, statuses & seed tickets
    ├── utils/
    │   └── storage.js                   # LocalStorage CRUD, CSV/JSON Blob export, ID generator
    └── components/
        ├── Header.jsx                   # Navigation, theme toggle, live pending badge
        ├── IssueForm.jsx                # Validated issue submission form
        ├── TicketList.jsx               # Searchable tracker with status progress tracks
        ├── AdminDashboard.jsx           # Analytics charts, KPI metrics & table actions
        ├── TicketModal.jsx              # Audit history timeline & technician notes modal
        └── Toast.jsx                    # Floating auto-dismiss notification stack
```

---

## ⚙️ Prerequisites & Setup

### Prerequisites
* **Node.js**: `v18.0.0` or higher (verified on `v20` / `v24`)
* **npm**: `v9.0.0` or higher (bundled with Node.js)

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/fatimaashar666-web/MCPpractice.git
   cd MCPpractice/campus-helpdesk
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser to [`http://localhost:5173`](http://localhost:5173).

---

## 🚀 Usage Guide

### 1. Submitting a Ticket
1. Click on the **"Submit Request"** tab in the top navigation.
2. Fill out your details (*Full Name*, *Campus Email*, *Location*, *Category*, and *Urgency*).
   * *Tip*: Click **"Auto-fill Sample Issue"** to quickly populate a realistic scenario for testing.
3. Click **"Submit Ticket"**. You will receive a success toast with your ticket ID (e.g. `TCK-1007`) and be redirected to the tracker.

### 2. Tracking Ticket Status
1. Navigate to the **"Track Issues"** tab.
2. Use the search bar to locate tickets by room number, subject, submitter name, or ticket ID.
3. Filter by status (`Pending`, `In Progress`, `Resolved`) or department.
4. Click **"View Details →"** on any card to view the complete timestamped activity history and copy the ID to your clipboard.

### 3. Admin Operations & Analytics
1. Navigate to the **"Admin Dashboard"** tab.
2. Review top-level KPI metrics, resolution rates, and department volume histograms.
3. **Change Status**: Select a new status from the inline dropdown in the management table.
4. **Edit Notes**: Click on *"Add staff note..."* to add diagnostic findings. If you attempt to click another row while a note has unsaved changes, the app will warn you before discarding.
5. **Data Export**: Click **"Export CSV"** or **"Export JSON"** in the table toolbar to download reporting spreadsheets or raw data backups.
6. **Reset / Clear**: Use **"Reset Demo Data"** to restore initial tickets, or **"Clear All"** to test an empty queue.

---

## 🛡️ Antigravity AI & Sandbox Integration

This project is configured with **Google Antigravity** custom agent lifecycle hooks located in [`.agents/hooks.json`](.agents/hooks.json):

* **`PreToolUse` Safety Guard**: Automatically intercepts terminal commands (`run_command`) and blocks destructive commands (e.g. `git reset --hard`, `git push --force`, `rm -rf /`, `drop database`).
* **`SessionStart` Hook**: Injects workspace readiness context when starting agent pair programming sessions.
* **`PreInvocation` Hook**: Ephemeral quality assurance hook reminding the model to enforce ESLint standards and clean state persistence.
* **Terminal Sandbox Compatible**: Fully compatible with Antigravity's OS-native terminal process isolation (`proceed-in-sandbox`).

---

## 📜 Available Scripts

| Command | Action |
|:---|:---|
| `npm run dev` | Starts the local Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles and minifies assets into the production-ready `dist/` folder. |
| `npm run preview` | Locally serves and previews the generated production build. |
| `npm run lint` | Runs ESLint across all `.js` and `.jsx` files to enforce code standards. |

---

## 📄 License

This project is licensed under the **MIT License**. Created for university campus support and facilities operations.
