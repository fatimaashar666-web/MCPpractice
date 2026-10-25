import { useState, useRef, useEffect } from 'react';
import { CATEGORIES, PRIORITIES, PRIORITY_META } from '../data/constants';

export default function IssueForm({ onSubmitTicket, onTabChange }) {
  const [formData, setFormData] = useState({
    submitterName: '',
    submitterEmail: '',
    studentId: '',
    category: CATEGORIES[0],
    priority: 'Medium',
    location: '',
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (submitTimerRef.current) {
        clearTimeout(submitTimerRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.submitterName.trim()) {
      newErrors.submitterName = 'Please provide your full name.';
    }

    const trimmedEmail = formData.submitterEmail.trim();
    if (!trimmedEmail) {
      newErrors.submitterEmail = 'Please provide your campus email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.submitterEmail = 'Please enter a valid email address.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Specify the building, hall, or campus location.';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Issue title is required.';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please detail what happened or what assistance you need.';
    } else if (formData.description.trim().length < 15) {
      newErrors.description = 'Description should be at least 15 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    submitTimerRef.current = setTimeout(() => {
      onSubmitTicket({
        ...formData,
        submitterName: formData.submitterName.trim(),
        submitterEmail: formData.submitterEmail.trim(),
        studentId: formData.studentId.trim() || 'STU-GUEST',
        location: formData.location.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
      });

      setIsSubmitting(false);

      // Reset form
      setFormData({
        submitterName: '',
        submitterEmail: '',
        studentId: '',
        category: CATEGORIES[0],
        priority: 'Medium',
        location: '',
        title: '',
        description: '',
      });
      setErrors({});
    }, 250);
  };

  const handleQuickFill = () => {
    setFormData({
      submitterName: 'Jordan Rivera',
      submitterEmail: 'jordan.rivera@campus.edu',
      studentId: 'STU-72941',
      category: 'IT & Wi-Fi',
      priority: 'High',
      location: 'Student Union, 2nd Floor Media Lounge',
      title: 'Eduroam Wi-Fi dropping repeatedly on laptops',
      description: 'Laptops in the media lounge continually lose connection to Eduroam every 10-15 minutes. Signal shows 4 bars but IP lease expires without renewing.',
    });
    setErrors({});
  };

  return (
    <div className="issue-form-section">
      <div className="form-card">
        <div className="form-header">
          <div className="form-header-badge">
            <span className="dot dot-pulse"></span> Open Service Request
          </div>
          <h1 className="form-title">Submit a Campus Helpdesk Ticket</h1>
          <p className="form-subtitle">
            Need assistance with campus IT, dorm maintenance, academic resources, or facilities? Fill out this request and our support desk will respond promptly.
          </p>
          <div className="quick-actions-bar">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleQuickFill}
              title="Auto-fill example data for quick testing"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
              </svg>
              Auto-fill Sample Issue
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onTabChange('tracker')}
              title="View and search submitted tickets"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Track Existing Issues
            </button>
            <span className="hint-text">All tickets are assigned status <strong>Pending</strong> initially</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="ticket-form">
          <div className="form-grid">
            {/* Submitter Name */}
            <div className="form-group">
              <label htmlFor="submitterName">
                Full Name <span className="req">*</span>
              </label>
              <input
                type="text"
                id="submitterName"
                name="submitterName"
                placeholder="e.g. Alex Johnson"
                value={formData.submitterName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.submitterName)}
                aria-describedby={errors.submitterName ? 'submitterName-error' : undefined}
                className={errors.submitterName ? 'input-error' : ''}
              />
              {errors.submitterName && (
                <span id="submitterName-error" className="field-error">
                  {errors.submitterName}
                </span>
              )}
            </div>

            {/* Submitter Email */}
            <div className="form-group">
              <label htmlFor="submitterEmail">
                Campus Email <span className="req">*</span>
              </label>
              <input
                type="email"
                id="submitterEmail"
                name="submitterEmail"
                placeholder="e.g. a.johnson@campus.edu"
                value={formData.submitterEmail}
                onChange={handleChange}
                aria-invalid={Boolean(errors.submitterEmail)}
                aria-describedby={errors.submitterEmail ? 'submitterEmail-error' : undefined}
                className={errors.submitterEmail ? 'input-error' : ''}
              />
              {errors.submitterEmail && (
                <span id="submitterEmail-error" className="field-error">
                  {errors.submitterEmail}
                </span>
              )}
            </div>

            {/* Student / Staff ID */}
            <div className="form-group">
              <label htmlFor="studentId">
                Student / Employee ID <span className="optional">(Optional)</span>
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                placeholder="e.g. STU-84920 or FAC-310"
                value={formData.studentId}
                onChange={handleChange}
              />
            </div>

            {/* Campus Location */}
            <div className="form-group">
              <label htmlFor="location">
                Location / Building / Room <span className="req">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g. Main Library 2nd Floor, Room 204, East Hall"
                value={formData.location}
                onChange={handleChange}
                aria-invalid={Boolean(errors.location)}
                aria-describedby={errors.location ? 'location-error' : undefined}
                className={errors.location ? 'input-error' : ''}
              />
              {errors.location && (
                <span id="location-error" className="field-error">
                  {errors.location}
                </span>
              )}
            </div>
          </div>

          <div className="form-grid-2">
            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">
                Issue Category <span className="req">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="form-group">
              <span id="priority-label" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                Urgency / Priority Level <span className="req">*</span>
              </span>
              <div
                className="priority-selector"
                role="radiogroup"
                aria-labelledby="priority-label"
              >
                {PRIORITIES.map((p) => {
                  const meta = PRIORITY_META[p];
                  const isSelected = formData.priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`priority-pill ${isSelected ? 'selected' : ''}`}
                      style={{
                        borderColor: isSelected ? meta.color : undefined,
                        backgroundColor: isSelected ? meta.bgColor : undefined,
                        color: isSelected ? meta.color : undefined,
                      }}
                      onClick={() => setFormData((prev) => ({ ...prev, priority: p }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setFormData((prev) => ({ ...prev, priority: p }));
                        }
                      }}
                    >
                      <span
                        className="priority-indicator-dot"
                        style={{ backgroundColor: meta.color }}
                      ></span>
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Issue Subject */}
          <div className="form-group">
            <label htmlFor="title">
              Issue Subject / Summary <span className="req">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Brief summary of the issue (e.g. Projector bulb burned out in Room 204)"
              value={formData.title}
              onChange={handleChange}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'title-error' : undefined}
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && (
              <span id="title-error" className="field-error">
                {errors.title}
              </span>
            )}
          </div>

          {/* Issue Description */}
          <div className="form-group">
            <label htmlFor="description">
              Detailed Description <span className="req">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Please provide specifics: when it started, error messages observed, troubleshooting tried, or exact room/equipment affected..."
              value={formData.description}
              onChange={handleChange}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'description-error' : undefined}
              className={errors.description ? 'input-error' : ''}
            ></textarea>
            {errors.description && (
              <span id="description-error" className="field-error">
                {errors.description}
              </span>
            )}
          </div>

          {/* Submission footer */}
          <div className="form-footer">
            <div className="form-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>Tickets are monitored 24/7 by Campus Operations. You will receive an immediate Ticket ID.</span>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setFormData({
                    submitterName: '',
                    submitterEmail: '',
                    studentId: '',
                    category: CATEGORIES[0],
                    priority: 'Medium',
                    location: '',
                    title: '',
                    description: '',
                  });
                  setErrors({});
                }}
              >
                Clear Form
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span> Submitting...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Submit Ticket
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Campus Info Cards */}
      <div className="campus-support-strip">
        <div className="support-info-card">
          <div className="support-icon it-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <div>
            <h3>IT & Network Support</h3>
            <p>Wi-Fi access, account password resets, lab workstation setup, campus portal bugs.</p>
          </div>
        </div>

        <div className="support-info-card">
          <div className="support-icon facilities-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
          </div>
          <div>
            <h3>Facilities & Residence</h3>
            <p>Dormitory plumbing, HVAC, lighting, locks, classroom AV equipment repair.</p>
          </div>
        </div>

        <div className="support-info-card">
          <div className="support-icon security-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div>
            <h3>Urgent Campus Dispatch</h3>
            <p>For immediate emergencies call Campus Safety at <strong>ext. 5555</strong> (24/7).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
