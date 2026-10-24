import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import IssueForm from './components/IssueForm';
import TicketList from './components/TicketList';
import AdminDashboard from './components/AdminDashboard';
import TicketModal from './components/TicketModal';
import Toast from './components/Toast';
import { STATUSES } from './data/constants';
import {
  loadTickets,
  saveTickets,
  loadTheme,
  saveTheme,
  generateTicketId,
  resetTicketsToDefault,
  clearAllTickets,
} from './utils/storage';
import './App.css';

export default function App() {
  const [tickets, setTickets] = useState(() => loadTickets());
  const [theme, setTheme] = useState(() => loadTheme());
  const [activeTab, setActiveTab] = useState('submit');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Sync to localStorage whenever tickets change
  useEffect(() => {
    saveTickets(tickets);
  }, [tickets]);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  // Derived selected ticket to ensure fresh state
  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null;
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  // Computed summary stats
  const ticketStats = useMemo(() => {
    return {
      total: tickets.length,
      pending: tickets.filter((t) => t.status === STATUSES.PENDING).length,
      inProgress: tickets.filter((t) => t.status === STATUSES.IN_PROGRESS).length,
      resolved: tickets.filter((t) => t.status === STATUSES.RESOLVED).length,
    };
  }, [tickets]);

  // Toast notification helper
  const addToast = (type, title, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  // Ticket creation handler
  const handleAddTicket = (formData) => {
    const newId = generateTicketId(tickets);
    const now = new Date().toISOString();

    const newTicket = {
      ...formData,
      id: newId,
      status: STATUSES.PENDING,
      createdAt: now,
      updatedAt: now,
      adminNote: '',
      history: [
        {
          status: STATUSES.PENDING,
          timestamp: now,
          note: `Issue submitted by ${formData.submitterName}`,
        },
      ],
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);

    addToast(
      'success',
      'Ticket Submitted!',
      `Ticket ${newId} created with status 'Pending'. You can track its progress anytime.`
    );

    // Switch to tracker view and highlight ticket
    setActiveTab('tracker');
  };

  // Ticket status and note updates
  const handleUpdateStatus = (ticketId, newStatus, newNote) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const now = new Date().toISOString();
        const updatedHistory = [...(t.history || [])];

        const statusChanged = Boolean(newStatus && newStatus !== t.status);
        const noteChanged = Boolean(newNote !== undefined && newNote !== t.adminNote);

        if (statusChanged && noteChanged) {
          updatedHistory.push({
            status: newStatus,
            timestamp: now,
            note: `Status changed to ${newStatus}. Note: ${newNote}`,
          });
        } else if (statusChanged) {
          updatedHistory.push({
            status: newStatus,
            timestamp: now,
            note: `Status updated to ${newStatus}`,
          });
        } else if (noteChanged) {
          updatedHistory.push({
            status: t.status,
            timestamp: now,
            note: 'Staff note updated',
          });
        }

        return {
          ...t,
          status: newStatus || t.status,
          adminNote: newNote !== undefined ? newNote : t.adminNote,
          updatedAt: now,
          history: updatedHistory,
        };
      })
    );

    if (newStatus) {
      addToast(
        'info',
        'Status Updated',
        `Ticket ${ticketId} status changed to '${newStatus}'`
      );
    } else if (newNote !== undefined) {
      addToast('success', 'Staff Note Saved', `Updated notes for ticket ${ticketId}`);
    }
  };

  // Delete ticket handler
  const handleDeleteTicket = (ticketId) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    if (selectedTicketId === ticketId) {
      setSelectedTicketId(null);
    }
    addToast('danger', 'Ticket Deleted', `Ticket ${ticketId} has been removed.`);
  };

  // Reset to initial mock data
  const handleResetSeedData = () => {
    const fresh = resetTicketsToDefault();
    setTickets(fresh);
    addToast('success', 'Sample Data Restored', 'Helpdesk loaded with realistic campus support tickets.');
  };

  // Clear all tickets
  const handleClearAll = () => {
    const empty = clearAllTickets();
    setTickets(empty);
    addToast('warning', 'Data Cleared', 'All tickets have been deleted.');
  };

  return (
    <div className="campus-app" data-theme={theme}>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ticketStats={ticketStats}
        theme={theme}
        onThemeChange={setTheme}
      />

      <main className="app-main">
        {activeTab === 'submit' && (
          <IssueForm
            onSubmitTicket={handleAddTicket}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === 'tracker' && (
          <TicketList
            tickets={tickets}
            onSelectTicket={(ticket) => setSelectedTicketId(ticket.id)}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            tickets={tickets}
            onUpdateStatus={handleUpdateStatus}
            onDeleteTicket={handleDeleteTicket}
            onSelectTicket={(ticket) => setSelectedTicketId(ticket.id)}
            onResetSeedData={handleResetSeedData}
            onClearAll={handleClearAll}
          />
        )}
      </main>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketModal
          key={selectedTicket.id}
          ticket={selectedTicket}
          onClose={() => setSelectedTicketId(null)}
          onUpdateStatus={handleUpdateStatus}
          onDeleteTicket={handleDeleteTicket}
        />
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Campus Portal Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-col">
            <div className="footer-brand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              <span>Campus Helpdesk & Operations</span>
            </div>
            <p className="footer-text">
              Unified support platform serving students, faculty, dorms, facilities, and campus operations.
            </p>
          </div>

          <div className="footer-col">
            <h4>Support Hours & Contact</h4>
            <ul className="footer-links">
              <li>IT Help Desk: Mon–Fri, 8 AM – 8 PM</li>
              <li>Facilities Emergency: 24/7 Hotline ext. 5555</li>
              <li>Email: helpdesk@campus.edu</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Quick Navigation</h4>
            <div className="footer-buttons">
              <button type="button" onClick={() => setActiveTab('submit')}>
                Submit Request
              </button>
              <button type="button" onClick={() => setActiveTab('tracker')}>
                Track Existing Issue
              </button>
              <button type="button" onClick={() => setActiveTab('admin')}>
                Admin Dashboard ({ticketStats.pending} Pending)
              </button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} University Campus Operations. Data persisted locally in browser localStorage.
          </div>
          <div className="footer-system-status">
            <span className="dot dot-emerald"></span>
            All Campus Systems Operational
          </div>
        </div>
      </footer>
    </div>
  );
}
