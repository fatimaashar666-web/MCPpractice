export default function Header({ activeTab, onTabChange, ticketStats }) {
  return (
    <header className="site-header">
      <div className="header-container">
        <div
          className="brand-group"
          onClick={() => onTabChange('submit')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onTabChange('submit');
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Campus Helpdesk Home - Submit Issue"
        >
          <div className="brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-title">
              <span>Campus</span>Helpdesk
            </div>
            <span className="brand-subtitle">Student & Staff Service Portal</span>
          </div>
        </div>

        <nav className="header-nav" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-btn ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => onTabChange('submit')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Submit Issue</span>
          </button>

          <button
            type="button"
            className={`nav-btn ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => onTabChange('tracker')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            <span>Track Issues</span>
            <span className="nav-badge count-badge">{ticketStats.total}</span>
          </button>

          <button
            type="button"
            className={`nav-btn nav-btn-admin ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => onTabChange('admin')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>Admin Dashboard</span>
            {ticketStats.pending > 0 && (
              <span className="nav-badge pending-badge" title={`${ticketStats.pending} Pending tickets`}>
                {ticketStats.pending}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

