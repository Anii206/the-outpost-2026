export function getDaysRemaining(deadlineStr: string): number {
  const deadline = new Date(deadlineStr);
  const now = new Date();
  deadline.setHours(0, 0, 0, 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatDeadlineBadge(deadlineStr: string): {
  text: string;
  isUrgent: boolean; // Amber (< 14 days)
  isCritical: boolean; // Red (< 7 days)
  daysRemaining: number;
} {
  const days = getDaysRemaining(deadlineStr);

  if (days < 0) {
    return { text: 'Closed', isUrgent: false, isCritical: false, daysRemaining: days };
  }
  if (days === 0) {
    return { text: 'Due Today!', isUrgent: false, isCritical: true, daysRemaining: 0 };
  }
  if (days === 1) {
    return { text: '1 day left!', isUrgent: false, isCritical: true, daysRemaining: 1 };
  }
  if (days <= 7) {
    return { text: `${days} days left`, isUrgent: false, isCritical: true, daysRemaining: days };
  }
  if (days <= 14) {
    return { text: `${days} days left`, isUrgent: true, isCritical: false, daysRemaining: days };
  }
  if (days <= 30) {
    return { text: `${days} days left`, isUrgent: false, isCritical: false, daysRemaining: days };
  }
  const months = Math.round(days / 30);
  return {
    text: `${days} days (~${months} mo)`,
    isUrgent: false,
    isCritical: false,
    daysRemaining: days
  };
}

export function formatReadableDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return new Date(dateStr).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format INR with standard Indian lakhs / crores commas or readable short notation
 */
export function formatINR(amount: number, short = false): string {
  if (short) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} Lakh`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}k`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
