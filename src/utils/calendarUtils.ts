import type { Scholarship } from '../types';

/**
 * Generate and trigger download of an RFC 5545 standard .ics calendar file
 */
export function downloadCalendarEvent(scholarship: Scholarship): void {
  const parts = scholarship.deadline.split('-');
  if (parts.length !== 3) return;

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  // Format as YYYYMMDD
  const dateFormatted = `${year}${month}${day}`;

  // Next day for all-day end
  const endDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10) + 1);
  const endYear = endDate.getFullYear();
  const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
  const endDay = String(endDate.getDate()).padStart(2, '0');
  const endDateFormatted = `${endYear}${endMonth}${endDay}`;

  const nowIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const cleanTitle = scholarship.name.replace(/,/g, '\\,');
  const cleanProvider = scholarship.provider.replace(/,/g, '\\,');
  const cleanDesc = `Scholarship Deadline for ${cleanTitle} (${scholarship.amountFormatted}) by ${cleanProvider}. Apply on portal: ${scholarship.websiteUrl}`.replace(/\n/g, '\\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Grantly//Scholarship Deadlines//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:grantly-${scholarship.id}-${dateFormatted}@grantly.app`,
    `DTSTAMP:${nowIso}`,
    `DTSTART;VALUE=DATE:${dateFormatted}`,
    `DTEND;VALUE=DATE:${endDateFormatted}`,
    `SUMMARY:Deadline: ${cleanTitle}`,
    `DESCRIPTION:${cleanDesc}`,
    `URL:${scholarship.websiteUrl}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Scholarship Application Deadline Tomorrow!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${scholarship.id}-deadline.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
