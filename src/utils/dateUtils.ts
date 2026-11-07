export function getDaysRemaining(deadlineStr: string): number {
  const deadline = new Date(deadlineStr);
  const now = new Date();
  // normalize to midnight
  deadline.setHours(0, 0, 0, 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatDeadlineBadge(deadlineStr: string): {
  text: string;
  isUrgent: boolean;
  daysRemaining: number;
} {
  const days = getDaysRemaining(deadlineStr);

  if (days < 0) {
    return { text: 'Deadline passed', isUrgent: false, daysRemaining: days };
  }
  if (days === 0) {
    return { text: 'Due today!', isUrgent: true, daysRemaining: 0 };
  }
  if (days === 1) {
    return { text: 'Due tomorrow', isUrgent: true, daysRemaining: 1 };
  }
  if (days <= 14) {
    return { text: `${days} days left`, isUrgent: true, daysRemaining: days };
  }
  if (days <= 30) {
    return { text: `${days} days left`, isUrgent: false, daysRemaining: days };
  }
  const months = Math.round(days / 30);
  return {
    text: `${days} days left (~${months} mo)`,
    isUrgent: false,
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
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
