---
name: campus-helpdesk
description: Comprehensive guide and development standards for maintaining, building, and extending the Campus Helpdesk React portal. Covers component architecture, responsive UI, issue validation, ticket lifecycle statuses, analytics, and verification workflows.
---

# Campus Helpdesk Agent Skill

This skill defines the technical standards, workflows, and best practices for developing, enhancing, and maintaining the **Campus Helpdesk** web application. Use this guide whenever you add features, refactor components, update status workflows, or modify data models in this project.

---

## 1. Writing Clean, Reusable React Components

Maintain a modular, decoupled component architecture:

- **Single Responsibility Principle**: Each component must do one thing well.
  - Form logic and inputs belong in `IssueForm.jsx`.
  - Public search, filtering, and ticket card display belong in `TicketList.jsx`.
  - Analytical metrics, visual progress bars, and administrative tables belong in `AdminDashboard.jsx`.
  - Modal inspections and history timelines belong in `TicketModal.jsx`.
  - Notifications belong in `Toast.jsx`.
- **Props & State Design**:
  - Keep state as local as possible. Hoist state to `App.jsx` only when shared across distinct views (e.g., global `tickets`, `activeTab`, `toasts`).
  - Use pure presentational child components where possible, passing callbacks (`onSelectTicket`, `onUpdateStatus`, `onDeleteTicket`) down cleanly.
  - Avoid duplicate state; compute derived values (e.g. filtered tickets, KPI statistics) using `useMemo`.
- **Naming Conventions & Clean Code**:
  - Component files use PascalCase (`AdminDashboard.jsx`, `IssueForm.jsx`).
  - Utility and constant files use camelCase (`storage.js`, `constants.js`).
  - Event handlers should follow the `handle[Action]` pattern (e.g., `handleSubmit`, `handleStatusChange`).
  - Preserve comments and docstrings. Write self-explanatory code with clean descriptive variable names.
- **Zero Heavy External Dependencies**:
  - Maintain the lightweight architecture: use native React hooks, pure inline SVGs for icons, and scoped CSS classes instead of pulling in bulky third-party component libraries.

---

## 2. Creating Responsive and Accessible UI

The Campus Helpdesk portal must provide a frictionless user experience on all devices (mobile phones, tablets, laptops, large monitors):

- **Fluid Layouts & Breakpoints**:
  - Design mobile-first or desktop-down with consistent breakpoints:
    - **Desktop**: Max container width `1240px` with multi-column grids (5 metric cards, 2-column analytics, 2-column forms).
    - **Tablet (`<= 1024px`)**: Collapse 5-column metric grids to 3 or 2 columns; stack analytics charts into a single column.
    - **Mobile (`<= 768px`)**: Stack header navigation, form inputs into 1 column; enable horizontal scroll on data tables.
    - **Small Screens (`<= 480px`)**: Full-width metric cards, stacked action buttons, and pinned bottom toast notifications.
- **Accessibility (a11y)**:
  - All interactive elements must have appropriate semantic HTML (`<button>`, `<input>`, `<select>`, `<textarea>`).
  - Form controls must have associated `<label htmlFor="...">` elements with matching `id` attributes.
  - Modal dialogs must have `role="dialog"`, `aria-modal="true"`, and support dismissal via backdrop clicks and escape keys.
  - Interactive icons or icon-only buttons must include descriptive `aria-label` or `title` attributes.
  - Maintain accessible color contrast ratios for text on status badges and priority tags.
- **Visual Feedback & Transitions**:
  - Interactive elements must show clear `:hover`, `:focus`, and `:active` states.
  - Form fields in focus must display a high-contrast focus ring (`var(--primary-ring)`).
  - Use micro-animations (toast slide-in, modal scale-up, button spinners) to inform the user of background actions without causing layout shift.

---

## 3. Validating Student Issue Form

All issue submissions through `IssueForm.jsx` must follow strict client-side validation rules before state mutation or storage:

### Validation Rules Matrix

| Field | Rule | Error Message |
| :--- | :--- | :--- |
| **Full Name** | Required, trimmed, non-empty | *"Please provide your full name."* |
| **Campus Email** | Required, valid regex pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` | *"Please enter a valid email address."* |
| **Location / Room** | Required, trimmed, non-empty | *"Specify the building, hall, or campus location."* |
| **Category** | Required, must match `CATEGORIES` list | Auto-selected by default |
| **Priority** | Required, must match `PRIORITIES` (`Low`, `Medium`, `High`, `Urgent`) | Defaults to `'Medium'` |
| **Issue Subject / Title** | Required, trimmed, min length $\ge 5$ characters | *"Title must be at least 5 characters long."* |
| **Detailed Description** | Required, trimmed, min length $\ge 15$ characters | *"Description should be at least 15 characters long."* |

### Validation Implementation Steps
1. Maintain an `errors` state object mapping field names to error strings.
2. Clear the specific field's error when the user modifies its input (`handleChange`).
3. Check all rules upon `handleSubmit`. Prevent submission and highlight invalid fields with `.input-error` and `.field-error` if errors exist.
4. On success:
   - Generate a unique ID (e.g. `TCK-XXXX`).
   - Assign initial status `Pending`.
   - Record initial submission timestamp and history node.
   - Reset form fields and error state.
   - Trigger a success toast and navigate to the ticket tracker view.

---

## 4. Managing Pending, In Progress, and Resolved Statuses

The Campus Helpdesk follows a strictly defined 3-stage lifecycle:

```text
[ Pending ]  ───►  [ In Progress ]  ───►  [ Resolved ]
    ▲                      ▲                     │
    └──────────────────────┴─────────────────────┘ (Can re-open if needed)
```

### Status Definitions & Visual Design System

1. **`Pending`**:
   - **Meaning**: New issue submitted by student/staff, awaiting triage or assignment.
   - **Color Theme**: Amber (`#d97706`), background `#fef3c7`, border `#fde68a`.
   - **Progress Stage**: Step 1 active.
2. **`In Progress`**:
   - **Meaning**: Technician or campus department has claimed the ticket and is actively investigating or repairing.
   - **Color Theme**: Royal Blue (`#2563eb`), background `#dbeafe`, border `#bfdbfe`.
   - **Progress Stage**: Step 1 & 2 active.
3. **`Resolved`**:
   - **Meaning**: The fix is completed, equipment replaced, or service restored.
   - **Color Theme**: Emerald Green (`#059669`), background `#d1fae5`, border `#a7f3d0`.
   - **Progress Stage**: Steps 1, 2, and 3 active.

### Lifecycle Rules & Audit History
- Every status transition must append an event to the ticket's `history` array:
  ```javascript
  {
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: `Status updated to ${newStatus}`
  }
  ```
- Updating internal staff notes must update `adminNote` and `updatedAt` without resetting the ticket's original `createdAt`.
- Updates must immediately sync to `localStorage` (`campus_helpdesk_tickets_v1`).

---

## 5. Keeping Dashboard Statistics Accurate

The Admin Dashboard provides real-time operational visibility. All KPI metrics and chart calculations must be derived dynamically from the source-of-truth `tickets` array:

### Metric Calculations

1. **Total Tickets**:
   $$\text{Total} = \text{tickets.length}$$
2. **Pending Count**:
   $$\text{Pending} = \text{tickets.filter}(t \Rightarrow t.\text{status} === \text{STATUSES.PENDING}).\text{length}$$
3. **In Progress Count**:
   $$\text{In Progress} = \text{tickets.filter}(t \Rightarrow t.\text{status} === \text{STATUSES.IN\_PROGRESS}).\text{length}$$
4. **Resolved Count**:
   $$\text{Resolved} = \text{tickets.filter}(t \Rightarrow t.\text{status} === \text{STATUSES.RESOLVED}).\text{length}$$
5. **Resolution Rate (%)**:
   $$\text{Resolution Rate} = \begin{cases} \text{Math.round}\left(\frac{\text{Resolved}}{\text{Total}} \times 100\right), & \text{if Total} > 0 \\ 0, & \text{otherwise} \end{cases}$$
6. **High & Urgent Priority Queue**:
   $$\text{Urgent/High} = \text{tickets.filter}(t \Rightarrow t.\text{priority} === 'Urgent' \lor t.\text{priority} === 'High').\text{length}$$
7. **Category & Priority Distributions**:
   - Compute counts for all pre-defined categories and priorities even if count is 0 to prevent UI flicker or division by zero.
   - Ensure progress bar width percentages always sum to $\le 100\%$.

Wrap all statistical calculations inside React's `useMemo` hook with `[tickets]` as the dependency to maintain performance.

---

## 6. Testing Changes and Running Build

Before submitting any code changes or marking a task complete, verify the application through both static analysis and production build steps:

### Verification Protocol

1. **Navigate to the Project Directory**:
   ```powershell
   cd "campus-helpdesk"
   ```

2. **Run Static Code Linting**:
   ```powershell
   npm run lint
   ```
   - Must exit with code `0`.
   - Ensure there are no unused imports, variables, or unescaped JSX entities.

3. **Run Production Build**:
   ```powershell
   npm run build
   ```
   - Verify that Vite completes production asset bundling without errors or warnings.
   - Verify `dist/index.html`, `dist/assets/*.css`, and `dist/assets/*.js` are created successfully.

4. **Verify LocalStorage Persistence**:
   - Test that submitting a ticket updates `localStorage.getItem('campus_helpdesk_tickets_v1')`.
   - Test that updating ticket status persists after page refresh.
   - Test "Reset Sample Data" and "Clear All" functionality.

---

## 7. Reporting Errors Honestly

Integrity and honesty are essential when reporting system status or errors:

- **Do Not Mask Failures**: If a build error, syntax error, or lint failure occurs, report the exact error message, file name, and line number.
- **Root Cause Explanation**: Explain *why* the error occurred (e.g. missing import, unhandled null case in storage parser, broken prop contract).
- **Verified Fixes Only**: Do not claim a problem is fixed without re-running the verification command (`npm run lint` / `npm run build`) and confirming exit code `0`.
- **User Transparency**: If an unexpected browser limitation or localStorage quota issue occurs, proactively explain the limitation to the user and present clear technical options.

