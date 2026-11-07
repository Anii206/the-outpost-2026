import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from '@phosphor-icons/react/dist/csr/Plus';
import { Trash } from '@phosphor-icons/react/dist/csr/Trash';
import { Clock } from '@phosphor-icons/react/dist/csr/Clock';
import { FileText } from '@phosphor-icons/react/dist/csr/FileText';
import { NotePencil } from '@phosphor-icons/react/dist/csr/NotePencil';
import { Check } from '@phosphor-icons/react/dist/csr/Check';
import { Kanban } from '@phosphor-icons/react/dist/csr/Kanban';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { useClickGuard } from '../hooks/useClickGuard';
import { usePageTitle } from '../hooks/usePageTitle';
import { SCHOLARSHIPS } from '../data/scholarships';
import type { TrackerStatus } from '../types';
import { formatDeadlineBadge } from '../utils/dateUtils';
import { fireAwardedConfetti } from '../utils/confetti';

interface ColumnDef {
  id: TrackerStatus;
  label: string;
}

export const TrackerPage: React.FC = () => {
  usePageTitle('Application Docket (Tracker) — Grantly Gazette');
  const {
    trackerItems,
    setTrackerStatus,
    updateTrackerNote,
    removeFromTracker,
    checkedDocs,
  } = useApp();

  const { showToast } = useToast();
  const { runGuarded, isGuarded } = useClickGuard(400);

  const [activeMobileTab, setActiveMobileTab] = useState<TrackerStatus>('applying');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TrackerStatus | null>(null);

  // Note editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  const columns: ColumnDef[] = [
    { id: 'saved', label: 'Docket Saved' },
    { id: 'applying', label: 'In Application' },
    { id: 'submitted', label: 'Submitted & Lodged' },
    { id: 'awarded', label: 'Awarded Grant' },
    { id: 'rejected', label: 'Concluded' },
  ];

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, scholarshipId: string) => {
    e.dataTransfer.setData('text/plain', scholarshipId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedId(scholarshipId);
  };

  const handleDragOver = (e: React.DragEvent, colId: TrackerStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetCol: TrackerStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    if (id) {
      const currentStatus = trackerItems[id]?.status;
      if (currentStatus === targetCol) {
        setDraggedId(null);
        setDragOverColumn(null);
        return; // Idempotent no-op
      }
      setTrackerStatus(id, targetCol);
      if (targetCol === 'awarded') {
        fireAwardedConfetti();
        showToast('Scholarship marked as Awarded! Congratulations on your educational grant.', 'success', `status-${id}`);
      } else {
        showToast(`Moved docket entry to "${targetCol.toUpperCase()}"`, 'success', `status-${id}`);
      }
    }
    setDraggedId(null);
    setDragOverColumn(null);
  };

  const handleStatusSelectChange = (scholarshipId: string, newStatus: TrackerStatus) => {
    const currentStatus = trackerItems[scholarshipId]?.status;
    if (currentStatus === newStatus) {
      return; // Idempotent no-op
    }
    setTrackerStatus(scholarshipId, newStatus);
    if (newStatus === 'awarded') {
      fireAwardedConfetti();
      showToast('Scholarship marked as Awarded! Congratulations on your educational grant.', 'success', `status-${scholarshipId}`);
    } else {
      showToast(`Docket status updated to "${newStatus.toUpperCase()}"`, 'success', `status-${scholarshipId}`);
    }
  };

  // Note editing save
  const handleStartEditNote = (scholarshipId: string, currentNote = '') => {
    setEditingNoteId(scholarshipId);
    setNoteText(currentNote);
  };

  const handleSaveNote = (scholarshipId: string) => {
    runGuarded(`note-${scholarshipId}`, () => {
      updateTrackerNote(scholarshipId, noteText);
      setEditingNoteId(null);
      showToast('Docket application note saved', 'success', `note-${scholarshipId}`);
    });
  };

  const handleRemoveScholarship = (scholarshipId: string) => {
    runGuarded(`remove-${scholarshipId}`, () => {
      removeFromTracker(scholarshipId);
      showToast('Scholarship removed from application docket', 'info', `track-${scholarshipId}`);
    });
  };

  return (
    <div id="main-content" className="min-h-screen py-8 bg-bg text-text transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Kanban size={18} className="text-primary" />
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-text">
                Application Docket & Workflow
              </h1>
            </div>
            <p className="font-sans text-xs sm:text-sm text-muted">
              Personal candidate docket to manage submissions, document assembly, and application status.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[2px] bg-primary text-primary-contrast text-xs font-semibold hover:opacity-90 transition-opacity self-start sm:self-auto min-h-[44px]"
          >
            <Plus size={14} />
            <span>Discover More Schemes</span>
          </Link>
        </div>

        {/* Mobile Horizontal Tab Switcher */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border">
          {columns.map((col) => {
            const count = Object.values(trackerItems).filter((i) => i.status === col.id).length;
            const isSelected = activeMobileTab === col.id;

            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setActiveMobileTab(col.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-medium whitespace-nowrap transition-colors min-h-[44px] ${
                  isSelected
                    ? 'bg-primary text-primary-contrast font-bold'
                    : 'bg-surface border border-border text-text hover:bg-surface-2'
                }`}
              >
                <span>{col.label}</span>
                <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded-[2px] ${
                  isSelected
                    ? 'bg-primary-contrast/20 text-primary-contrast'
                    : 'bg-surface-2 text-text border border-border'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Kanban Board Container (Desktop: 5 Ruled Columns, Mobile: Active Tab Column) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-start">
          {columns.map((col) => {
            const itemsInCol = Object.values(trackerItems).filter((item) => item.status === col.id);
            const isDropTarget = dragOverColumn === col.id;
            const isMobileHidden = activeMobileTab !== col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`rounded-[4px] border transition-colors p-3.5 flex flex-col min-h-[520px] ${
                  isMobileHidden ? 'hidden md:flex' : 'flex'
                } ${
                  isDropTarget
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-surface shadow-2xs'
                }`}
                aria-label={`${col.label} column, ${itemsInCol.length} scholarships`}
              >
                {/* Column Header with Ruled Border */}
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-border mb-3">
                  <span className="font-serif font-bold text-xs uppercase tracking-wider text-text truncate">
                    {col.label}
                  </span>
                  <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-[2px] font-bold bg-surface-2 text-text border border-border">
                    {itemsInCol.length}
                  </span>
                </div>

                {/* Column Cards / Empty State */}
                <div className="space-y-2.5 flex-1">
                  {itemsInCol.length === 0 ? (
                    <div className="text-center py-12 px-2.5 rounded-[2px] border border-dashed border-border text-muted text-xs font-sans">
                      <p className="font-semibold text-text">No active dockets</p>
                      <p className="text-[11px] mt-1 text-muted">
                        Drag cards here or use the card dropdown
                      </p>
                    </div>
                  ) : (
                    itemsInCol.map((item) => {
                      const sch = SCHOLARSHIPS.find((s) => s.id === item.scholarshipId);
                      if (!sch) return null;

                      const deadlineInfo = formatDeadlineBadge(sch.deadline);
                      const docsForSch = sch.documentsRequired;
                      const checkedDocsCount = (checkedDocs[sch.id] || []).length;
                      const docPercent =
                        docsForSch.length > 0
                          ? Math.round((checkedDocsCount / docsForSch.length) * 100)
                          : 0;
                      const isEditingThisNote = editingNoteId === sch.id;

                      return (
                        <div
                          key={item.scholarshipId}
                          draggable
                          onDragStart={(e) => handleDragStart(e, sch.id)}
                          className={`bg-surface-2 rounded-[2px] border p-3.5 transition-all duration-200 cursor-grab active:cursor-grabbing space-y-2.5 ${
                            draggedId === sch.id
                              ? 'opacity-40 border-dashed border-primary shadow-none'
                              : 'border-border hover:border-primary/50 hover:shadow-hard'
                          }`}
                          aria-label={`Scholarship ${sch.name}, status ${item.status}`}
                        >
                          {/* Top provider & remove */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-muted truncate">
                              {sch.provider}
                            </span>
                            <button
                              type="button"
                              disabled={isGuarded(`remove-${sch.id}`)}
                              onClick={() => handleRemoveScholarship(sch.id)}
                              className="text-muted hover:text-danger p-0.5 rounded-[2px] transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center disabled:opacity-50"
                              title="Remove from docket"
                              aria-label={`Remove ${sch.name} from docket`}
                            >
                              <Trash size={14} />
                            </button>
                          </div>

                          {/* Scheme Name */}
                          <Link
                            to={`/scholarship/${sch.id}`}
                            className="font-serif text-sm font-bold text-text hover:text-primary transition-colors leading-snug block line-clamp-2"
                          >
                            {sch.name}
                          </Link>

                          {/* Award Amount */}
                          <div className="font-mono text-sm font-bold text-primary">
                            {sch.amountFormatted}
                          </div>

                          {/* Deadline Stamp */}
                          <div>
                            <div className="deadline-stamp text-[9px] py-0 px-1.5">
                              <Clock size={10} weight="bold" />
                              <span>{deadlineInfo.text}</span>
                            </div>
                          </div>

                          {/* Documents Checklist Progress */}
                          <div className="pt-2 border-t border-border space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-sans">
                              <span className="text-muted font-medium flex items-center gap-1">
                                <FileText size={12} /> Dossier Docs
                              </span>
                              <span className="font-mono font-bold text-text">
                                {checkedDocsCount}/{docsForSch.length}
                              </span>
                            </div>
                            <div className="w-full bg-surface border border-border h-1.5 rounded-[2px] overflow-hidden">
                              <div
                                className="bg-primary h-full transition-all duration-300"
                                style={{ width: `${docPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Editable Note Section */}
                          <div className="pt-2 border-t border-border">
                            {isEditingThisNote ? (
                              <div className="space-y-1.5">
                                <textarea
                                  value={noteText}
                                  onChange={(e) => setNoteText(e.target.value)}
                                  placeholder="Add interview dates, token IDs, or notes..."
                                  rows={2}
                                  className="w-full p-2 text-xs border border-border rounded-[2px] focus:outline-none focus:ring-1 focus:ring-primary bg-surface text-text font-sans"
                                  autoFocus
                                />
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setEditingNoteId(null)}
                                    className="px-2 py-1 text-[11px] text-muted hover:text-text min-h-[32px]"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isGuarded(`note-${sch.id}`)}
                                    onClick={() => handleSaveNote(sch.id)}
                                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-primary text-primary-contrast rounded-[2px] min-h-[32px] disabled:opacity-50"
                                  >
                                    <Check size={12} /> Save
                                  </button>
                                </div>
                              </div>
                            ) : item.notes ? (
                              <div
                                onClick={() => handleStartEditNote(sch.id, item.notes)}
                                className="group p-2 rounded-[2px] bg-surface hover:border-primary/40 cursor-pointer border border-border text-[11px] text-text flex items-start justify-between gap-1"
                                title="Click to amend application note"
                              >
                                <span className="italic font-sans leading-tight line-clamp-2">{item.notes}</span>
                                <NotePencil size={13} className="text-muted group-hover:text-text shrink-0 mt-0.5" />
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStartEditNote(sch.id)}
                                className="text-[11px] text-muted hover:text-text flex items-center gap-1 font-medium min-h-[32px]"
                              >
                                <NotePencil size={13} />
                                <span>Record application note</span>
                              </button>
                            )}
                          </div>

                          {/* Status dropdown for touch / keyboard navigation */}
                          <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                            <label htmlFor={`status-select-${sch.id}`} className="font-sans text-[10px] font-bold text-muted uppercase">
                              Stage:
                            </label>
                            <select
                              id={`status-select-${sch.id}`}
                              value={item.status}
                              onChange={(e) => handleStatusSelectChange(sch.id, e.target.value as TrackerStatus)}
                              className="text-xs font-semibold text-text bg-surface border border-border rounded-[2px] px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary min-h-[36px]"
                            >
                              <option value="saved" className="bg-surface text-text">Saved</option>
                              <option value="applying" className="bg-surface text-text">Applying</option>
                              <option value="submitted" className="bg-surface text-text">Submitted</option>
                              <option value="awarded" className="bg-surface text-text">Awarded</option>
                              <option value="rejected" className="bg-surface text-text">Concluded</option>
                            </select>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
