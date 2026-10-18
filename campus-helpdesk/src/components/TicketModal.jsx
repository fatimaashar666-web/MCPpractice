import { useState, useEffect } from 'react';
import {
  STATUSES,
  STATUS_LIST,
  STATUS_META,
  PRIORITY_META,
} from '../data/constants';
import { formatDate } from '../utils/storage';

export default function TicketModal({ ticket, onClose, onUpdateStatus, onDeleteTicket }) {
  const [noteText, setNoteText] = useState(ticket?.adminNote || '');
  const [copied, setCopied] = useState(false);

  // Dismiss modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!ticket) return null;

  const statusMeta = STATUS_META[ticket.status] || STATUS_META[STATUSES.PENDING];
  const priorityMeta = PRIORITY_META[ticket.priority] || PRIORITY_META.Medium;

  const handleCopyId = () => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(ticket.id);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy ticket ID to clipboard:', err);
    }
  };

  const handleSaveNote = () => {
    onUpdateStatus(ticket.id, null, noteText);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content ticket-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-area">
            <div className="modal-id-row">
              <span className="modal-ticket-id">{ticket.id}</span>
              <button
                type="button"
                className="btn-copy-id"
                onClick={handleCopyId}
                title="Copy Ticket ID"
              >
                {copied ? '✓ Copied' : 'Copy ID'}
              </button>
              <span
                className="status-badge"
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
                {ticket.priority} Priority
              </span>
            </div>
            <h2 className="modal-ticket-title">{ticket.title}</h2>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Status Quick Switch Bar */}
          <div className="status-quick-switch-bar">
            <span className="switch-label">Update Status:</span>
            <div className="status-switch-buttons">
              {STATUS_LIST.map((statusName) => {
                const isCurrent = ticket.status === statusName;
                const meta = STATUS_META[statusName];
                return (
                  <button
                    key={statusName}
                    type="button"
                    className={`status-switch-btn ${isCurrent ? 'active' : ''}`}
                    style={
                      isCurrent
                        ? {
                            backgroundColor: meta.bgColor,
                            borderColor: meta.color,
                            color: meta.color,
                            fontWeight: 600,
                          }
                        : {}
                    }
                    onClick={() => onUpdateStatus(ticket.id, statusName)}
                  >
                    <span className="dot" style={{ backgroundColor: meta.color }}></span>
                    {statusName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ticket Information Grid */}
          <div className="ticket-info-grid">
            <div className="info-box">
              <span className="info-label">Submitter</span>
              <span className="info-value">{ticket.submitterName}</span>
              <span className="info-sub">{ticket.submitterEmail}</span>
            </div>

            <div className="info-box">
              <span className="info-label">Student / Employee ID</span>
              <span className="info-value">{ticket.studentId || 'N/A'}</span>
            </div>

            <div className="info-box">
              <span className="info-label">Campus Location</span>
              <span className="info-value">{ticket.location}</span>
            </div>

            <div className="info-box">
              <span className="info-label">Category</span>
              <span className="info-value">{ticket.category}</span>
            </div>

            <div className="info-box">
              <span className="info-label">Date Submitted</span>
              <span className="info-value">{formatDate(ticket.createdAt)}</span>
            </div>

            <div className="info-box">
              <span className="info-label">Last Updated</span>
              <span className="info-value">{formatDate(ticket.updatedAt || ticket.createdAt)}</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="detail-section">
            <h4 className="section-label">Detailed Description</h4>
            <div className="description-text-box">{ticket.description}</div>
          </div>

          {/* Admin / Technician Remarks */}
          <div className="detail-section">
            <h4 className="section-label">Campus Staff / Technician Notes</h4>
            <div className="admin-notes-area">
              <textarea
                rows="3"
                placeholder="Enter technician diagnostic notes, parts needed, or resolution summary..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="admin-textarea"
              ></textarea>
              <div className="notes-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleSaveNote}
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>

          {/* Activity / Status History */}
          {ticket.history && ticket.history.length > 0 && (
            <div className="detail-section">
              <h4 className="section-label">Activity & Status History</h4>
              <div className="timeline-trail">
                {ticket.history.map((event, index) => {
                  const meta = STATUS_META[event.status] || STATUS_META[STATUSES.PENDING];
                  return (
                    <div key={index} className="timeline-node">
                      <div className="timeline-dot" style={{ backgroundColor: meta.color }}></div>
                      <div className="timeline-content">
                        <div className="timeline-head">
                          <span className="timeline-status" style={{ color: meta.color }}>
                            {event.status}
                          </span>
                          <span className="timeline-date">{formatDate(event.timestamp)}</span>
                        </div>
                        {event.note && <div className="timeline-note">{event.note}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-danger-outline btn-sm"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ticket ${ticket.id}?`)) {
                onDeleteTicket(ticket.id);
                onClose();
              }
            }}
          >
            Delete Ticket
          </button>

          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

