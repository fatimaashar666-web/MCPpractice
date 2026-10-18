import { useState, useMemo } from 'react';
import { STATUSES, STATUS_META, PRIORITY_META, CATEGORIES } from '../data/constants';
import { formatDate, formatTimeAgo } from '../utils/storage';

export default function TicketList({ tickets, onSelectTicket, onTabChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        (t.studentId && t.studentId.toLowerCase().includes(q)) ||
        t.submitterName.toLowerCase().includes(q) ||
        t.submitterEmail.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') {
        const order = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return (order[b.priority] || 0) - (order[a.priority] || 0);
      }
      return 0;
    });
  }, [tickets, searchQuery, statusFilter, categoryFilter, sortBy]);

  const counts = useMemo(() => {
    return {
      all: tickets.length,
      pending: tickets.filter((t) => t.status === STATUSES.PENDING).length,
      inProgress: tickets.filter((t) => t.status === STATUSES.IN_PROGRESS).length,
      resolved: tickets.filter((t) => t.status === STATUSES.RESOLVED).length,
    };
  }, [tickets]);

  return (
    <div className="tracker-section">
      <div className="section-header-row">
        <div>
          <h1 className="section-title">Track Campus Issues</h1>
          <p className="section-subtitle">
            Search your ticket status, review progress updates from technicians, and track resolution timelines.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onTabChange('submit')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Ticket
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="tracker-filter-card">
        <div className="search-box">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search by ticket ID (e.g. TCK-1001), keywords, submitter name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search tickets"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
              aria-label="Clear search query"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Pills */}
        <div className="filter-controls-row">
          <div className="status-tabs" role="tablist" aria-label="Filter tickets by status">
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === 'ALL'}
              className={`status-tab ${statusFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setStatusFilter('ALL')}
            >
              All Statuses <span className="tab-count">{counts.all}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === STATUSES.PENDING}
              className={`status-tab ${statusFilter === STATUSES.PENDING ? 'active tab-pending' : ''}`}
              onClick={() => setStatusFilter(STATUSES.PENDING)}
            >
              <span className="dot dot-amber"></span> Pending <span className="tab-count">{counts.pending}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === STATUSES.IN_PROGRESS}
              className={`status-tab ${statusFilter === STATUSES.IN_PROGRESS ? 'active tab-in-progress' : ''}`}
              onClick={() => setStatusFilter(STATUSES.IN_PROGRESS)}
            >
              <span className="dot dot-blue"></span> In Progress <span className="tab-count">{counts.inProgress}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={statusFilter === STATUSES.RESOLVED}
              className={`status-tab ${statusFilter === STATUSES.RESOLVED ? 'active tab-resolved' : ''}`}
              onClick={() => setStatusFilter(STATUSES.RESOLVED)}
            >
              <span className="dot dot-emerald"></span> Resolved <span className="tab-count">{counts.resolved}</span>
            </button>
          </div>

          <div className="secondary-filters">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
              aria-label="Filter by category"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
              aria-label="Sort tickets"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="priority">Sort: Highest Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ticket List Cards */}
      {filteredTickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h3>No matching tickets found</h3>
          <p>
            {searchQuery || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
              ? 'Try adjusting your search criteria or filter options.'
              : 'No tickets have been submitted yet.'}
          </p>
          <div className="empty-actions">
            {(searchQuery || statusFilter !== 'ALL' || categoryFilter !== 'ALL') ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setCategoryFilter('ALL');
                }}
              >
                Reset Filters
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onTabChange('submit')}
              >
                Submit Your First Ticket
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="ticket-cards-grid">
          {filteredTickets.map((ticket) => {
            const statusMeta = STATUS_META[ticket.status] || STATUS_META[STATUSES.PENDING];
            const priorityMeta = PRIORITY_META[ticket.priority] || PRIORITY_META.Medium;

            const progressStage =
              ticket.status === STATUSES.PENDING
                ? 1
                : ticket.status === STATUSES.IN_PROGRESS
                ? 2
                : 3;

            return (
              <div
                key={ticket.id}
                className="ticket-card"
                onClick={() => onSelectTicket(ticket)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTicket(ticket);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View ticket ${ticket.id}: ${ticket.title}`}
              >
                <div className="ticket-card-header">
                  <div className="ticket-badges">
                    <span className="ticket-id-tag">{ticket.id}</span>
                    <span
                      className={`status-badge ${statusMeta.badgeClass}`}
                      style={{
                        color: statusMeta.color,
                        backgroundColor: statusMeta.bgColor,
                        borderColor: statusMeta.borderColor,
                      }}
                    >
                      <span className="status-badge-dot" style={{ backgroundColor: statusMeta.color }}></span>
                      {ticket.status}
                    </span>
                    <span
                      className="priority-badge"
                      style={{
                        color: priorityMeta.color,
                        backgroundColor: priorityMeta.bgColor,
                      }}
                    >
                      {ticket.priority}
                    </span>
                  </div>

                  <span className="ticket-time" title={formatDate(ticket.createdAt)}>
                    {formatTimeAgo(ticket.createdAt)}
                  </span>
                </div>

                <h3 className="ticket-title">{ticket.title}</h3>
                <p className="ticket-description-snippet">{ticket.description}</p>

                {/* Progress bar visualizer */}
                <div className="status-progress-track">
                  <div className="progress-steps">
                    <div className={`step-item ${progressStage >= 1 ? 'active' : ''}`}>
                      <div className="step-circle">1</div>
                      <span>Pending</span>
                    </div>
                    <div className={`step-line ${progressStage >= 2 ? 'active' : ''}`}></div>
                    <div className={`step-item ${progressStage >= 2 ? 'active' : ''}`}>
                      <div className="step-circle">2</div>
                      <span>In Progress</span>
                    </div>
                    <div className={`step-line ${progressStage >= 3 ? 'active' : ''}`}></div>
                    <div className={`step-item ${progressStage >= 3 ? 'active' : ''}`}>
                      <div className="step-circle">3</div>
                      <span>Resolved</span>
                    </div>
                  </div>
                </div>

                <div className="ticket-card-footer">
                  <div className="ticket-meta-info">
                    <span className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {ticket.location}
                    </span>
                    <span className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      {ticket.category}
                    </span>
                    <span className="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      {ticket.submitterName}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="view-details-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTicket(ticket);
                    }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

