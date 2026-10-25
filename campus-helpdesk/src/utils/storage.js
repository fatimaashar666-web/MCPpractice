import { INITIAL_TICKETS } from '../data/constants';

const STORAGE_KEY = 'campus_helpdesk_tickets_v1';
const THEME_STORAGE_KEY = 'campus_helpdesk_theme_v1';

export function loadTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error);
    return 'light';
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
  }
}

export function loadTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = JSON.parse(JSON.stringify(INITIAL_TICKETS));
      saveTickets(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    // If empty array, keep it or return empty
    if (Array.isArray(parsed)) {
      return parsed;
    }
    const initial = JSON.parse(JSON.stringify(INITIAL_TICKETS));
    saveTickets(initial);
    return initial;
  } catch (error) {
    console.error('Failed to load tickets from localStorage:', error);
    return JSON.parse(JSON.stringify(INITIAL_TICKETS));
  }
}

export function saveTickets(tickets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    return true;
  } catch (error) {
    console.error('Failed to save tickets to localStorage:', error);
    return false;
  }
}

export function generateTicketId(existingTickets = []) {
  const existingIds = new Set(existingTickets.map((t) => t.id));
  let attempts = 0;
  while (attempts < 1000) {
    const num = Math.floor(1000 + Math.random() * 9000);
    const candidate = `TCK-${num}`;
    if (!existingIds.has(candidate)) {
      return candidate;
    }
    attempts++;
  }
  const timestamp = Date.now().toString().slice(-4);
  const randomSuffix = Math.floor(10 + Math.random() * 90);
  let candidate = `TCK-${timestamp}${randomSuffix}`;
  let fallbackCount = 1;
  while (existingIds.has(candidate)) {
    candidate = `TCK-${timestamp}${randomSuffix}${fallbackCount++}`;
  }
  return candidate;
}

export function resetTicketsToDefault() {
  const initial = JSON.parse(JSON.stringify(INITIAL_TICKETS));
  saveTickets(initial);
  return initial;
}

export function clearAllTickets() {
  saveTickets([]);
  return [];
}

export function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function formatTimeAgo(isoString) {
  if (!isoString) return '';
  const now = new Date();
  const date = new Date(isoString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export function exportTicketsToJSON(tickets) {
  const blob = new Blob([JSON.stringify(tickets, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute(
    'download',
    `campus_helpdesk_tickets_${new Date().toISOString().slice(0, 10)}.json`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}

export function exportTicketsToCSV(tickets) {
  if (!tickets || !tickets.length) return;
  const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Submitter', 'Email', 'Location', 'Created At'];
  const rows = tickets.map((t) => [
    `"${(t.id || '').replace(/"/g, '""')}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    `"${(t.priority || '').replace(/"/g, '""')}"`,
    `"${(t.status || '').replace(/"/g, '""')}"`,
    `"${(t.submitterName || '').replace(/"/g, '""')}"`,
    `"${(t.submitterEmail || '').replace(/"/g, '""')}"`,
    `"${(t.location || '').replace(/"/g, '""')}"`,
    `"${(t.createdAt || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', url);
  downloadAnchor.setAttribute(
    'download',
    `campus_helpdesk_tickets_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}
