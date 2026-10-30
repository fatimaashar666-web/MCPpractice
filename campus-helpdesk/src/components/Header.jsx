export default function Header({ activeTab, onTabChange, ticketStats, theme, onThemeChange, language, onLanguageChange, campus, onCampusChange }) {
  const isUrdu = language === 'ur';

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="header-leading-controls">
          <label className="campus-selector">
            <span>{isUrdu ? 'کیمپس' : 'Campus'}</span>
            <select value={campus} onChange={(event) => onCampusChange(event.target.value)} aria-label={isUrdu ? 'کیمپس منتخب کریں' : 'Select campus'}>
              <option>Main Campus</option>
              <option>North Campus</option>
              <option>East Campus</option>
              <option>West Campus</option>
            </select>
          </label>
          <div className="language-toggle" role="group" aria-label="Language selector">
            <button
              type="button"
              className={`language-option ${!isUrdu ? 'active' : ''}`}
              onClick={() => onLanguageChange('en')}
              aria-pressed={!isUrdu}
            >
              English
            </button>
            <button
              type="button"
              className={`language-option ${isUrdu ? 'active' : ''}`}
              onClick={() => onLanguageChange('ur')}
              aria-pressed={isUrdu}
            >
              اردو
            </button>
          </div>
        </div>

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
          aria-label={isUrdu ? 'کیمپس ہیلپ ڈیسک ہوم - مسئلہ جمع کریں' : 'Campus Helpdesk Home - Submit Issue'}
        >
          <div className="brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-title">
              <span>{isUrdu ? 'کیمپس' : 'Campus'}</span>{isUrdu ? ' ہیلپ ڈیسک' : 'Helpdesk'}
            </div>
            <span className="brand-subtitle">{isUrdu ? 'طلبہ اور عملے کا سروس پورٹل' : 'Student & Staff Service Portal'}</span>
          </div>
        </div>

        <div className="header-controls">
          <nav className="header-nav" aria-label={isUrdu ? 'مرکزی نیویگیشن' : 'Main Navigation'}>
            <button
              type="button"
              className={`nav-btn ${activeTab === 'submit' ? 'active' : ''}`}
              onClick={() => onTabChange('submit')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>{isUrdu ? 'مسئلہ جمع کریں' : 'Submit Issue'}</span>
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
              <span>{isUrdu ? 'مسائل کا جائزہ' : 'Track Issues'}</span>
              <span className="nav-badge count-badge">{ticketStats.total}</span>
            </button>

            <button
              type="button"
              className={`nav-btn ${activeTab === 'recycling' ? 'active' : ''}`}
              onClick={() => onTabChange('recycling')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 19h10" />
                <path d="M9 19V8h6v11" />
                <path d="M8 8h8M10 5h4" />
                <path d="M5 13a7 7 0 0 1 2-5M5 8l2 .5L6.5 11" />
                <path d="M19 13a7 7 0 0 1-2 5M19 18l-2-.5.5-2.5" />
              </svg>
              <span>{isUrdu ? 'ری سائیکلنگ تجاویز' : 'Recycling Tips'}</span>
            </button>

            <button
              type="button"
              className={`nav-btn nav-btn-admin ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => onTabChange('admin')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>{isUrdu ? 'ایڈمن ڈیش بورڈ' : 'Admin Dashboard'}</span>
              {ticketStats.pending > 0 && (
                <span className="nav-badge pending-badge" title={`${ticketStats.pending} Pending tickets`}>
                  {ticketStats.pending}
                </span>
              )}
            </button>
          </nav>

          <div className="theme-toggle" role="group" aria-label="Color theme">
            <button
              type="button"
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => onThemeChange('light')}
              aria-pressed={theme === 'light'}
            >
              Light
            </button>
            <button
              type="button"
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => onThemeChange('dark')}
              aria-pressed={theme === 'dark'}
            >
              Dark
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
