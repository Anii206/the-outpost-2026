import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Clock, 
  FileText, 
  Edit3, 
  Check, 
  KanbanSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { SCHOLARSHIPS } from '../data/scholarships';
import type { TrackerStatus } from '../types';
import { formatDeadlineBadge } from '../utils/dateUtils';

interface ColumnDef {
  id: TrackerStatus;
  label: string;
  countColor: string;
  columnBg: string;
  badgeBg: string;
}

export const TrackerPage: React.FC = () => {
  usePageTitle('Application Tracker');
  const { 
    trackerItems, 
    setTrackerStatus, 
    updateTrackerNote, 
    removeFromTracker,
    checkedDocs 
  } = useApp();

  const { showToast } = useToast();

  const [activeMobileTab, setActiveMobileTab] = useState<TrackerStatus>('applying');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TrackerStatus | null>(null);
  
  // Note editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  const columns: ColumnDef[] = [
    { 
      id: 'saved', 
      label: 'Saved', 
      countColor: 'bg-surface-2 text-text border border-border',
      columnBg: 'bg-surface-2',
      badgeBg: 'bg-surface-2 text-text border border-border'
    },
    { 
      id: 'applying', 
      label: 'Applying', 
      countColor: 'bg-accent/15 text-accent border border-accent/30',
      columnBg: 'bg-accent/5',
      badgeBg: 'bg-accent/15 text-accent border border-accent/30'
    },
    { 
      id: 'submitted', 
      label: 'Submitted', 
      countColor: 'bg-primary/15 text-primary border border-primary/30',
      columnBg: 'bg-primary/5',
      badgeBg: 'bg-primary/15 text-primary border border-primary/30'
    },
    { 
      id: 'awarded', 
      label: 'Awarded', 
      countColor: 'bg-success/15 text-success border border-success/30',
      columnBg: 'bg-success/5',
      badgeBg: 'bg-success/15 text-success border border-success/30'
    },
    { 
      id: 'rejected', 
      label: 'Rejected', 
      countColor: 'bg-danger/15 text-danger border border-danger/30',
      columnBg: 'bg-danger/5',
      badgeBg: 'bg-danger/15 text-danger border border-danger/30'
    },
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
      setTrackerStatus(id, targetCol);
      showToast(`Moved to "${targetCol.toUpperCase()}"`, 'success');
    }
    setDraggedId(null);
    setDragOverColumn(null);
  };

  // Note editing save
  const handleStartEditNote = (scholarshipId: string, currentNote = '') => {
    setEditingNoteId(scholarshipId);
    setNoteText(currentNote);
  };

  const handleSaveNote = (scholarshipId: string) => {
    updateTrackerNote(scholarshipId, noteText);
    setEditingNoteId(null);
    showToast('Application note saved', 'success');
  };

  return (
    <div id="main-content" className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <KanbanSquare className="w-5 h-5 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">
                Application Tracker
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted">
              Drag and drop scholarship cards across stages, track gathered documents, and record application notes.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-contrast text-xs font-bold shadow-xs hover:opacity-95 transition-opacity self-start sm:self-auto min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Discover More Schemes</span>
          </Link>
        </div>

        {/* Mobile Horizontal Tab Switcher */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border">
          {columns.map((col) => {
            const count = Object.values(trackerItems).filter(i => i.status === col.id).length;
            const isSelected = activeMobileTab === col.id;

            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setActiveMobileTab(col.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all min-h-[44px] ${
                  isSelected
                    ? 'bg-primary text-primary-contrast shadow-xs'
                    : 'bg-surface border border-border text-text hover:bg-surface-2'
                }`}
              >
                <span>{col.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-primary-contrast/20 text-primary-contrast' : 'bg-surface-2 text-text border border-border'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Kanban Board Container (Desktop: 5 Columns, Mobile: Active Tab Column) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-5 items-start">
          {columns.map((col) => {
            const itemsInCol = Object.values(trackerItems).filter(item => item.status === col.id);
            const isDropTarget = dragOverColumn === col.id;
            const isMobileHidden = activeMobileTab !== col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`rounded-3xl border transition-all p-3.5 sm:p-4 flex flex-col min-h-[500px] ${
                  isMobileHidden ? 'hidden md:flex' : 'flex'
                } ${
                  isDropTarget 
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-md' 
                    : 'border-border bg-surface shadow-2xs'
                }`}
                aria-label={`${col.label} column, ${itemsInCol.length} scholarships`}
              >
                
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-text">
                      {col.label}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-extrabold bg-surface-2 text-text border border-border">
                      {itemsInCol.length}
                    </span>
                  </div>
                </div>

                {/* Column Cards / Empty State */}
                <div className="space-y-3 flex-1">
                  {itemsInCol.length === 0 ? (
                    <div className="text-center py-12 px-3 rounded-2xl border border-dashed border-border text-muted text-xs">
                      <p className="font-semibold">No scholarships</p>
                      <p className="text-[11px] mt-1 text-muted">
                        Drag cards here or change status dropdown
                      </p>
                    </div>
                  ) : (
                    itemsInCol.map((item) => {
                      const sch = SCHOLARSHIPS.find(s => s.id === item.scholarshipId);
                      if (!sch) return null;

                      const deadlineInfo = formatDeadlineBadge(sch.deadline);
                      const docsForSch = sch.documentsRequired;
                      const checkedDocsCount = (checkedDocs[sch.id] || []).length;
                      const docPercent = docsForSch.length > 0 ? Math.round((checkedDocsCount / docsForSch.length) * 100) : 0;
                      const isEditingThisNote = editingNoteId === sch.id;

                      return (
                        <div
                          key={item.scholarshipId}
                          draggable
                          onDragStart={(e) => handleDragStart(e, sch.id)}
                          className={`bg-surface-2 rounded-2xl border p-4 shadow-2xs hover:shadow-xs transition-all cursor-grab active:cursor-grabbing space-y-3 ${
                            draggedId === sch.id ? 'opacity-40 scale-95 border-dashed border-primary' : 'border-border'
                          }`}
                          aria-label={`Scholarship ${sch.name}, status ${item.status}`}
                        >
                          {/* Top provider & remove */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted truncate">
                              {sch.provider}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromTracker(sch.id)}
                              className="text-muted hover:text-danger p-1 rounded-md transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                              title="Remove from tracker"
                              aria-label={`Remove ${sch.name} from tracker`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Scheme Name */}
                          <Link
                            to={`/scholarship/${sch.id}`}
                            className="text-sm font-bold text-text hover:text-primary transition-colors leading-snug block"
                          >
                            {sch.name}
                          </Link>

                          {/* Award Amount */}
                          <div className="text-base font-extrabold text-primary">
                            {sch.amountFormatted}
                          </div>

                          {/* Deadline countdown */}
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] ${
                              deadlineInfo.isCritical 
                                ? 'bg-danger/10 text-danger border border-danger/30' 
                                : deadlineInfo.isUrgent 
                                ? 'bg-accent/15 text-accent border border-accent/30' 
                                : 'bg-surface text-muted border border-border'
                            }`}>
                              <Clock className="w-3 h-3" />
                              {deadlineInfo.text}
                            </span>
                          </div>

                          {/* Documents Checklist Progress */}
                          <div className="pt-2 border-t border-border space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-muted font-semibold flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Documents
                              </span>
                              <span className="font-bold text-text">
                                {checkedDocsCount} / {docsForSch.length}
                              </span>
                            </div>
                            <div className="w-full bg-surface border border-border/50 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full transition-all duration-300"
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
                                  placeholder="Add interview dates, application notes, or token numbers..."
                                  rows={2}
                                  className="w-full p-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary bg-surface text-text"
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
                                    onClick={() => handleSaveNote(sch.id)}
                                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-primary text-primary-contrast rounded-md min-h-[32px]"
                                  >
                                    <Check className="w-3 h-3" /> Save
                                  </button>
                                </div>
                              </div>
                            ) : item.notes ? (
                              <div 
                                onClick={() => handleStartEditNote(sch.id, item.notes)}
                                className="group p-2 rounded-lg bg-surface hover:border-primary/50 cursor-pointer border border-border text-[11px] text-text flex items-start justify-between gap-1"
                                title="Click to edit note"
                              >
                                <span className="italic leading-tight">{item.notes}</span>
                                <Edit3 className="w-3 h-3 text-muted group-hover:text-text shrink-0 mt-0.5" />
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStartEditNote(sch.id)}
                                className="text-[11px] text-muted hover:text-text flex items-center gap-1 font-semibold min-h-[32px]"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Add personal note</span>
                              </button>
                            )}
                          </div>

                          {/* Status dropdown for Touch / Keyboard Accessibility */}
                          <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                            <label htmlFor={`status-select-${sch.id}`} className="text-[10px] font-bold text-muted uppercase">
                              Move to:
                            </label>
                            <select
                              id={`status-select-${sch.id}`}
                              value={item.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as TrackerStatus;
                                setTrackerStatus(sch.id, newStatus);
                                showToast(`Moved to "${newStatus.toUpperCase()}"`, 'success');
                              }}
                              className="text-xs font-bold text-text bg-surface border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary min-h-[36px]"
                            >
                              <option value="saved" className="bg-surface text-text">Saved</option>
                              <option value="applying" className="bg-surface text-text">Applying</option>
                              <option value="submitted" className="bg-surface text-text">Submitted</option>
                              <option value="awarded" className="bg-surface text-text">Awarded</option>
                              <option value="rejected" className="bg-surface text-text">Rejected</option>
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
