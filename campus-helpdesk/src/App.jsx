import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import IssueForm from './components/IssueForm';
import TicketList from './components/TicketList';
import AdminDashboard from './components/AdminDashboard';
import TicketModal from './components/TicketModal';
import Toast from './components/Toast';
import RecyclingTips from './components/RecyclingTips';
import { translate } from './utils/language';
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
  const [language, setLanguage] = useState('en');
  const [campus, setCampus] = useState('Main Campus');
  const [activeTab, setActiveTab] = useState('submit');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const t = (text) => translate(text, language);

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
    let statusWasChanged = false;
    let noteWasChanged = false;

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const statusChanged = Boolean(newStatus && newStatus !== t.status);
        const noteChanged = Boolean(newNote !== undefined && newNote !== t.adminNote);

        if (!statusChanged && !noteChanged) {
          return t;
        }

        statusWasChanged = statusChanged;
        noteWasChanged = noteChanged;

        const now = new Date().toISOString();
        const updatedHistory = [...(t.history || [])];

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

    if (statusWasChanged) {
      addToast(
        'info',
        'Status Updated',
        `Ticket ${ticketId} status changed to '${newStatus}'`
      );
    } else if (noteWasChanged) {
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
    <div className="campus-app" data-theme={theme} data-language={language} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        ticketStats={ticketStats}
        theme={theme}
        onThemeChange={setTheme}
        language={language}
        onLanguageChange={setLanguage}
        campus={campus}
        onCampusChange={setCampus}
      />

      <main className="app-main">
        {activeTab === 'submit' && (
          <IssueForm
            onSubmitTicket={handleAddTicket}
            onTabChange={setActiveTab}
            language={language}
          />
        )}

        {activeTab === 'tracker' && (
          <TicketList
            tickets={tickets}
            onSelectTicket={(ticket) => setSelectedTicketId(ticket.id)}
            onTabChange={setActiveTab}
            language={language}
          />
        )}

        {activeTab === 'recycling' && (
          <RecyclingTips onTabChange={setActiveTab} language={language} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            tickets={tickets}
            onUpdateStatus={handleUpdateStatus}
            onDeleteTicket={handleDeleteTicket}
            onSelectTicket={(ticket) => setSelectedTicketId(ticket.id)}
            onResetSeedData={handleResetSeedData}
            onClearAll={handleClearAll}
            language={language}
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
          language={language}
        />
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} language={language} />

      {/* Campus Portal Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-col">
            <div className="footer-brand">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              <span>{t('Campus Helpdesk & Operations')}</span>
            </div>
            <p className="footer-text">
              {t('Unified support platform serving students, faculty, dorms, facilities, and campus operations.')}
            </p>
            <div className="footer-social-links" aria-label={language === 'ur' ? 'سوشل میڈیا لنکس' : 'Social media links'}>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3.31 0-5 1.69-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.66.34-1 1-1Z" /></svg>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" className="social-fill" /></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" title="X">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.8h1.73L8.27 4.08H6.41L17.8 19.8Z" /></svg>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5A2.5 2.5 0 1 1 5 8a2.5 2.5 0 0 1 0-4.5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-1 1.82-2.06 3.75-2.06 4 0 4.75 2.63 4.75 6.05V21h-4v-5.66c0-1.35-.03-3.09-1.88-3.09-1.88 0-2.17 1.47-2.17 2.99V21H9V9Z" /></svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>{t('Support Hours & Contact')}</h4>
            <ul className="footer-links">
              <li>IT Help Desk: Mon–Fri, 8 AM – 8 PM</li>
              <li>Facilities Emergency: 24/7 Hotline ext. 5555</li>
              <li>Email: helpdesk@campus.edu</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('Quick Navigation')}</h4>
            <div className="footer-buttons">
              <button type="button" onClick={() => setActiveTab('submit')}>
                {t('Submit Request')}
              </button>
              <button type="button" onClick={() => setActiveTab('tracker')}>
                {t('Track Existing Issue')}
              </button>
              <button type="button" onClick={() => setActiveTab('admin')}>
                {t('Admin Dashboard')} ({ticketStats.pending} {t('Pending')})
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
            {t('All Campus Systems Operational')}
          </div>
        </div>
      </footer>
    </div>
  );
}
