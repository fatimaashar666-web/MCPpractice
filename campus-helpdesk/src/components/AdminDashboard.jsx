import { useState, useMemo, useEffect } from 'react';
import {
  STATUSES,
  STATUS_LIST,
  STATUS_META,
  PRIORITIES,
  PRIORITY_META,
  CATEGORIES,
} from '../data/constants';
import {
  formatDate,
  formatTimeAgo,
  exportTicketsToCSV,
  exportTicketsToJSON,
} from '../utils/storage';

export default function AdminDashboard({
  tickets,
  onUpdateStatus,
  onDeleteTicket,
  onSelectTicket,
  onResetSeedData,
  onClearAll,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [adminNoteEdit, setAdminNoteEdit] = useState({ id: null, text: '' });
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Close confirmation modals on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowConfirmReset(false);
        setShowConfirmClear(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = tickets.length;
    const pending = tickets.filter((t) => t.status === STATUSES.PENDING).length;
    const inProgress = tickets.filter((t) => t.status === STATUSES.IN_PROGRESS).length;
    const resolved = tickets.filter((t) => t.status === STATUSES.RESOLVED).length;
    const urgentHigh = tickets.filter((t) => t.priority === 'Urgent' || t.priority === 'High').length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Category breakdown
    const categoryCounts = {};
    CATEGORIES.forEach((cat) => {
      categoryCounts[cat] = 0;
    });
    tickets.forEach((t) => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });

    // Priority breakdown
    const priorityCounts = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
    tickets.forEach((t) => {
      if (priorityCounts[t.priority] !== undefined) {
        priorityCounts[t.priority]++;
      }
    });

    return {
      total,
      pending,
      inProgress,
      resolved,
      urgentHigh,
      resolutionRate,
      categoryCounts,
      priorityCounts,
    };
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (t.id && t.id.toLowerCase().includes(q)) ||
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.studentId && t.studentId.toLowerCase().includes(q)) ||
        (t.submitterName && t.submitterName.toLowerCase().includes(q)) ||
        (t.submitterEmail && t.submitterEmail.toLowerCase().includes(q)) ||
        (t.location && t.location.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q));

      const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
      const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;
      const matchesCategory = filterCategory === 'ALL' || t.category === filterCategory;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [tickets, searchTerm, filterStatus, filterPriority, filterCategory]);

  const handleSaveNote = (ticketId) => {
    onUpdateStatus(ticketId, null, adminNoteEdit.text);
    setAdminNoteEdit({ id: null, text: '' });
  };

  return (
    <div className="admin-dashboard-section">
      {/* Top Banner / Heading */}
      <div className="admin-header-row">
        <div>
          <div className="admin-portal-badge">
            <span className="dot dot-emerald"></span> Operations Command Center
          </div>
          <h1 className="section-title">Helpdesk Administration & Analytics</h1>
          <p className="section-subtitle">
            Real-time status tracking, workload distribution, ticket reassignment, and service performance metrics.
          </p>
        </div>

        <div className="admin-top-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => exportTicketsToCSV(tickets)}
            disabled={tickets.length === 0}
            title="Download CSV spreadsheet"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export CSV
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => exportTicketsToJSON(tickets)}
            disabled={tickets.length === 0}
            title="Download JSON backup"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            Export JSON
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowConfirmReset(true)}
            title="Restore sample realistic tickets"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            Reset Sample Data
          </button>

          <button
            type="button"
            className="btn btn-outline btn-sm btn-danger-outline"
            onClick={() => setShowConfirmClear(true)}
            disabled={tickets.length === 0}
            title="Clear all tickets in queue"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Clear All
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showConfirmReset && (
        <div className="modal-backdrop" onClick={() => setShowConfirmReset(false)}>
          <div className="modal-content confirmation-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3>Reset Helpdesk Data?</h3>
            <p>
              This will repopulate the tickets in localStorage with default campus support sample data. Any custom tickets added will be reset.
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowConfirmReset(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onResetSeedData();
                  setShowConfirmReset(false);
                }}
              >
                Yes, Reset Sample Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Clear All */}
      {showConfirmClear && (
        <div className="modal-backdrop" onClick={() => setShowConfirmClear(false)}>
          <div className="modal-content confirmation-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon" style={{ backgroundColor: '#fee2e2' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3>Clear All Tickets?</h3>
            <p>
              Are you sure you want to delete all tickets? You can restore sample tickets anytime using the "Reset Sample Data" button.
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowConfirmClear(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ backgroundColor: '#dc2626' }}
                onClick={() => {
                  onClearAll();
                  setShowConfirmClear(false);
                }}
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Statistics Grid */}
      <div className="stats-metric-grid">
        <div className="metric-card metric-total">
          <div className="metric-header">
            <span className="metric-label">Total Tickets</span>
            <div className="metric-icon total-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
          </div>
          <div className="metric-value">{stats.total}</div>
          <div className="metric-footer">All logged campus service tickets</div>
        </div>

        <div className="metric-card metric-pending">
          <div className="metric-header">
            <span className="metric-label">Pending</span>
            <div className="metric-icon pending-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
          <div className="metric-value">{stats.pending}</div>
          <div className="metric-footer">
            {stats.total > 0 ? `${Math.round((stats.pending / stats.total) * 100)}% of total queue` : '0%'}
          </div>
        </div>

        <div className="metric-card metric-inprogress">
          <div className="metric-header">
            <span className="metric-label">In Progress</span>
            <div className="metric-icon inprogress-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
          </div>
          <div className="metric-value">{stats.inProgress}</div>
          <div className="metric-footer">
            {stats.total > 0 ? `${Math.round((stats.inProgress / stats.total) * 100)}% actively worked` : '0%'}
          </div>
        </div>

        <div className="metric-card metric-resolved">
          <div className="metric-header">
            <span className="metric-label">Resolved</span>
            <div className="metric-icon resolved-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          <div className="metric-value">{stats.resolved}</div>
          <div className="metric-footer">
            <strong className="text-emerald">{stats.resolutionRate}%</strong> resolution rate
          </div>
        </div>

        <div className="metric-card metric-urgent">
          <div className="metric-header">
            <span className="metric-label">High / Urgent</span>
            <div className="metric-icon urgent-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
          </div>
          <div className="metric-value">{stats.urgentHigh}</div>
          <div className="metric-footer">Critical priority tickets needing attention</div>
        </div>
      </div>

      {/* Visual Distribution Charts */}
      <div className="charts-double-row">
        {/* Category Breakdown */}
        <div className="analytics-card">
          <div className="card-header-flex">
            <h3>Issue Breakdown by Category</h3>
            <span className="card-badge">{CATEGORIES.length} Categories</span>
          </div>
          <div className="category-bars-list">
            {CATEGORIES.map((cat) => {
              const count = stats.categoryCounts[cat] || 0;
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={cat} className="bar-item">
                  <div className="bar-label-group">
                    <span className="bar-label">{cat}</span>
                    <span className="bar-count">
                      {count} <span className="bar-pct">({pct}%)</span>
                    </span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${pct}%`,
                        backgroundColor:
                          cat === 'IT & Wi-Fi'
                            ? '#3b82f6'
                            : cat === 'Facilities & Maintenance'
                            ? '#f59e0b'
                            : cat === 'Academic & Registrar'
                            ? '#8b5cf6'
                            : cat === 'Campus Security & Safety'
                            ? '#ef4444'
                            : '#10b981',
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority & Status Breakdown */}
        <div className="analytics-card">
          <div className="card-header-flex">
            <h3>Priority Distribution & Queue Health</h3>
            <span className="card-badge">Live Status</span>
          </div>

          <div className="priority-distribution-grid">
            {PRIORITIES.map((p) => {
              const count = stats.priorityCounts[p] || 0;
              const meta = PRIORITY_META[p];
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div
                  key={p}
                  className="priority-stat-box"
                  style={{ borderColor: meta.borderColor, backgroundColor: meta.bgColor }}
                >
                  <div className="priority-stat-head">
                    <span className="dot" style={{ backgroundColor: meta.color }}></span>
                    <span className="priority-name" style={{ color: meta.color }}>
                      {p}
                    </span>
                  </div>
                  <div className="priority-stat-num" style={{ color: meta.color }}>
                    {count}
                  </div>
                  <div className="priority-stat-pct">{pct}% of tickets</div>
                </div>
              );
            })}
          </div>

          <div className="status-progress-composite">
            <div className="composite-label">Overall Resolution Pipeline</div>
            <div className="composite-bar">
              <div
                className="composite-segment segment-pending"
                style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
                title={`Pending: ${stats.pending}`}
              ></div>
              <div
                className="composite-segment segment-inprogress"
                style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
                title={`In Progress: ${stats.inProgress}`}
              ></div>
              <div
                className="composite-segment segment-resolved"
                style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
                title={`Resolved: ${stats.resolved}`}
              ></div>
            </div>
            <div className="composite-legend">
              <span>
                <span className="legend-dot bg-amber"></span> Pending ({stats.pending})
              </span>
              <span>
                <span className="legend-dot bg-blue"></span> In Progress ({stats.inProgress})
              </span>
              <span>
                <span className="legend-dot bg-emerald"></span> Resolved ({stats.resolved})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Management Table Section */}
      <div className="admin-table-container">
        <div className="table-header-controls">
          <div className="table-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Filter by ID, student name, issue or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Filter tickets by keyword"
            />
          </div>

          <div className="table-dropdowns">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="table-filter-select"
              aria-label="Filter by status"
            >
              <option value="ALL">All Statuses ({tickets.length})</option>
              <option value={STATUSES.PENDING}>Pending ({stats.pending})</option>
              <option value={STATUSES.IN_PROGRESS}>In Progress ({stats.inProgress})</option>
              <option value={STATUSES.RESOLVED}>Resolved ({stats.resolved})</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="table-filter-select"
              aria-label="Filter by priority"
            >
              <option value="ALL">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p} ({stats.priorityCounts[p] || 0})
                </option>
              ))}
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="table-filter-select"
              aria-label="Filter by category"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count & quick clear */}
        <div className="table-status-bar">
          <span>
            Showing <strong>{filteredTickets.length}</strong> of <strong>{tickets.length}</strong> tickets
          </span>
          {(searchTerm || filterStatus !== 'ALL' || filterPriority !== 'ALL' || filterCategory !== 'ALL') && (
            <button
              type="button"
              className="btn-text"
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('ALL');
                setFilterPriority('ALL');
                setFilterCategory('ALL');
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Responsive Table / Cards */}
        {filteredTickets.length === 0 ? (
          <div className="empty-state table-empty">
            <p>No tickets match the selected filters.</p>
          </div>
        ) : (
          <div className="admin-tickets-table-wrapper">
            <table className="admin-tickets-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Submitter & Location</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status & Quick Action</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => {
                  const statusMeta = STATUS_META[t.status] || STATUS_META[STATUSES.PENDING];
                  const priorityMeta = PRIORITY_META[t.priority] || PRIORITY_META.Medium;
                  const isEditingNote = adminNoteEdit.id === t.id;

                  return (
                    <tr key={t.id} className={`table-row status-border-${t.status.toLowerCase().replace(' ', '-')}`}>
                      <td className="cell-ticket">
                        <div
                          className="ticket-id-bold"
                          onClick={() => onSelectTicket(t)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onSelectTicket(t);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`View ticket ${t.id}`}
                        >
                          {t.id}
                        </div>
                        <div
                          className="ticket-title-link"
                          onClick={() => onSelectTicket(t)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onSelectTicket(t);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          title={t.title}
                          aria-label={`View details for ${t.title}`}
                        >
                          {t.title}
                        </div>
                      </td>

                      <td className="cell-submitter">
                        <div className="submitter-name">{t.submitterName}</div>
                        <div className="submitter-sub">{t.submitterEmail}</div>
                        <div className="submitter-loc">{t.location}</div>
                      </td>

                      <td className="cell-category">
                        <span className="category-pill">{t.category}</span>
                      </td>

                      <td className="cell-priority">
                        <span
                          className="priority-badge"
                          style={{
                            color: priorityMeta.color,
                            backgroundColor: priorityMeta.bgColor,
                          }}
                        >
                          {t.priority}
                        </span>
                      </td>

                      <td className="cell-status">
                        {/* Status Select with direct update */}
                        <div className="status-selector-wrapper">
                          <select
                            value={t.status}
                            onChange={(e) => onUpdateStatus(t.id, e.target.value)}
                            className={`status-dropdown dropdown-${t.status.toLowerCase().replace(' ', '-')}`}
                            style={{
                              color: statusMeta.color,
                              borderColor: statusMeta.borderColor,
                              backgroundColor: statusMeta.bgColor,
                            }}
                          >
                            {STATUS_LIST.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quick admin note inline preview */}
                        {isEditingNote ? (
                          <div className="inline-note-editor">
                            <input
                              type="text"
                              value={adminNoteEdit.text}
                              onChange={(e) => setAdminNoteEdit({ ...adminNoteEdit, text: e.target.value })}
                              placeholder="Staff note / tech update..."
                              className="note-input"
                              autoFocus
                            />
                            <div className="note-buttons">
                              <button
                                type="button"
                                className="btn-micro btn-primary"
                                onClick={() => handleSaveNote(t.id)}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="btn-micro btn-secondary"
                                onClick={() => setAdminNoteEdit({ id: null, text: '' })}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="admin-note-preview"
                            onClick={() => {
                              if (
                                adminNoteEdit.id &&
                                adminNoteEdit.id !== t.id &&
                                adminNoteEdit.text !==
                                  (tickets.find((item) => item.id === adminNoteEdit.id)?.adminNote || '')
                              ) {
                                if (
                                  !window.confirm(
                                    'You have unsaved notes for another ticket. Discard them?'
                                  )
                                ) {
                                  return;
                                }
                              }
                              setAdminNoteEdit({ id: t.id, text: t.adminNote || '' });
                            }}
                            title="Click to edit internal note"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            <span>{t.adminNote ? t.adminNote : 'Add staff note...'}</span>
                          </div>
                        )}
                      </td>

                      <td className="cell-date">
                        <span title={formatDate(t.createdAt)}>{formatTimeAgo(t.createdAt)}</span>
                      </td>

                      <td className="cell-actions">
                        <div className="action-buttons-group">
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => onSelectTicket(t)}
                            title="View Full Ticket Details"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>

                          <button
                            type="button"
                            className="btn-icon btn-icon-delete"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ticket ${t.id}?`)) {
                                onDeleteTicket(t.id);
                              }
                            }}
                            title="Delete Ticket"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
