import { useEffect } from 'react';

export function usePageTitle(title?: string): void {
  useEffect(() => {
    const base = 'GRANTLY';
    if (title) {
      document.title = `${title} | ${base}`;
    } else {
      document.title = 'GRANTLY — India’s Scholarship Discovery & Application Tracker';
    }
  }, [title]);
}
