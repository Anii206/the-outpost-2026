import React from 'react';
import { ShareNetwork } from '@phosphor-icons/react/dist/csr/ShareNetwork';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useClickGuard } from '../hooks/useClickGuard';
import { SCHOLARSHIPS } from '../data/scholarships';
import { getDaysRemaining } from '../utils/dateUtils';

interface ShareShortlistButtonProps {
  className?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatShortlistDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const mon = MONTHS[monthIdx] || parts[1];
      return `${day} ${mon} ${year}`;
    }
    const d = new Date(dateStr);
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function buildShortlistSummary(
  savedIds: string[],
  trackerItems: Record<string, { status?: string }>
): string | null {
  const uniqueIds = Array.from(new Set([...savedIds, ...Object.keys(trackerItems)]));
  if (uniqueIds.length === 0) return null;

  const items = uniqueIds
    .map((id) => {
      const sch = SCHOLARSHIPS.find((s) => s.id === id);
      if (!sch) return null;
      const trackerEntry = trackerItems[id];
      const statusRaw = trackerEntry?.status || 'saved';
      const statusLabel = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);
      return { sch, statusLabel };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (items.length === 0) return null;

  // Sort by nearest deadline ascending
  items.sort((a, b) => new Date(a.sch.deadline).getTime() - new Date(b.sch.deadline).getTime());

  const lines = [
    'My scholarship shortlist (GRANTLY)',
    ...items.map((item, idx) => {
      const days = getDaysRemaining(item.sch.deadline);
      const daysText = days < 0 ? 'Closed' : days === 1 ? '1 day left' : `${days} days left`;
      const dateFormatted = formatShortlistDate(item.sch.deadline);
      return `${idx + 1}. ${item.sch.name} - ${item.sch.amountFormatted} - Deadline: ${dateFormatted} (${daysText}) - Status: ${item.statusLabel}`;
    }),
    '',
    'Confirm details on each official portal.',
  ];

  return lines.join('\n');
}

export const ShareShortlistButton: React.FC<ShareShortlistButtonProps> = ({ className = '' }) => {
  const { savedIds, trackerItems } = useApp();
  const { showToast } = useToast();
  const { runGuarded, isGuarded } = useClickGuard(400);

  const totalCount = savedIds.length + Object.keys(trackerItems).length;
  const isDisabled = totalCount === 0;

  const handleShare = async () => {
    if (isDisabled) return;

    runGuarded('share-shortlist', async () => {
      const text = buildShortlistSummary(savedIds, trackerItems);
      if (!text) return;

      let sharedViaNavigator = false;
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
          await navigator.share({
            title: 'My scholarship shortlist (GRANTLY)',
            text,
          });
          sharedViaNavigator = true;
          showToast('Shortlist copied', 'success', 'share-shortlist');
          return;
        } catch (err: unknown) {
          // If aborted/cancelled by user, do nothing further
          if (err instanceof Error && err.name === 'AbortError') {
            return;
          }
          sharedViaNavigator = false;
        }
      }

      if (!sharedViaNavigator) {
        let copied = false;
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          try {
            await navigator.clipboard.writeText(text);
            copied = true;
          } catch {
            copied = false;
          }
        }

        if (!copied && typeof document !== 'undefined') {
          // Document execCommand fallback
          try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '0';
            textArea.setAttribute('readonly', '');
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            copied = true;
          } catch {
            copied = false;
          }
        }

        showToast('Shortlist copied', 'success', 'share-shortlist');
      }
    });
  };

  return (
    <button
      type="button"
      disabled={isDisabled || isGuarded('share-shortlist')}
      onClick={handleShare}
      title={isDisabled ? 'Save or track a scholarship first' : 'Share shortlist'}
      aria-label={isDisabled ? 'Save or track a scholarship first' : 'Share scholarship shortlist'}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] border border-border bg-surface hover:bg-surface-2 text-text text-xs font-semibold transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface ${className}`}
    >
      <ShareNetwork size={15} className="text-primary shrink-0" />
      <span>Share shortlist</span>
    </button>
  );
};
