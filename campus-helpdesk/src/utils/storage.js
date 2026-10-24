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
      saveTickets(INITIAL_TICKETS);
      return INITIAL_TICKETS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    // If empty array, keep it or return empty
    if (Array.isArray(parsed)) {
      return parsed;
    }
    saveTickets(INITIAL_TICKETS);
    return INITIAL_TICKETS;
  } catch (error) {
    console.error('Failed to load tickets from localStorage:', error);
    return INITIAL_TICKETS;
  }
}

export function saveTickets(tickets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (error) {
    console.error('Failed to save tickets to localStorage:', error);
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
  return `TCK-${Date.now().toString().slice(-4)}`;
}

export function resetTicketsToDefault() {
  saveTickets(INITIAL_TICKETS);
  return INITIAL_TICKETS;
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
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tickets, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `campus_helpdesk_tickets_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportTicketsToCSV(tickets) {
  if (!tickets || !tickets.length) return;
  const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Submitter', 'Email', 'Location', 'Created At'];
  const rows = tickets.map((t) => [
    `"${t.id}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${t.category || ''}"`,
    `"${t.priority || ''}"`,
    `"${t.status || ''}"`,
    `"${(t.submitterName || '').replace(/"/g, '""')}"`,
    `"${t.submitterEmail || ''}"`,
    `"${(t.location || '').replace(/"/g, '""')}"`,
    `"${t.createdAt || ''}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', encodedUri);
  downloadAnchor.setAttribute('download', `campus_helpdesk_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
