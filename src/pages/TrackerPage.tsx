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
  const { 
    trackerItems, 
    setTrackerStatus, 
    updateTrackerNote, 
    removeFromTracker,
    checkedDocs 
  } = useApp();

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
      countColor: 'bg-stone-200 text-stone-800',
      columnBg: 'bg-stone-100/60',
      badgeBg: 'bg-stone-200 text-stone-800'
    },
    { 
      id: 'applying', 
      label: 'Applying', 
      countColor: 'bg-amber-100 text-amber-900',
      columnBg: 'bg-amber-50/40',
      badgeBg: 'bg-amber-100 text-amber-900 border border-amber-300'
    },
    { 
      id: 'submitted', 
      label: 'Submitted', 
      countColor: 'bg-blue-100 text-blue-900',
      columnBg: 'bg-blue-50/40',
      badgeBg: 'bg-blue-100 text-blue-900 border border-blue-300'
    },
    { 
      id: 'awarded', 
      label: 'Awarded', 
      countColor: 'bg-emerald-100 text-emerald-900',
      columnBg: 'bg-emerald-50/40',
      badgeBg: 'bg-emerald-100 text-emerald-900 border border-emerald-300'
    },
    { 
      id: 'rejected', 
      label: 'Rejected', 
      countColor: 'bg-rose-100 text-rose-900',
      columnBg: 'bg-rose-50/30',
      badgeBg: 'bg-rose-100 text-rose-900 border border-rose-300'
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
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <KanbanSquare className="w-5 h-5 text-[#133E2B]" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#133E2B]">
                Application Tracker
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600">
              Drag and drop scholarship cards across stages, track gathered documents, and record application notes.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#133E2B] hover:bg-[#1B533A] text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Discover More Schemes</span>
          </Link>
        </div>

        {/* Mobile Horizontal Tab Switcher */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-stone-200">
          {columns.map((col) => {
            const count = Object.values(trackerItems).filter(i => i.status === col.id).length;
            const isSelected = activeMobileTab === col.id;

            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setActiveMobileTab(col.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#133E2B] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{col.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-800'
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
                    ? 'border-[#133E2B] bg-emerald-50/50 ring-2 ring-[#133E2B]/20 shadow-md' 
                    : 'border-stone-200/90 bg-white/70'
                }`}
                aria-label={`${col.label} column, ${itemsInCol.length} scholarships`}
              >
                
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200/70 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-stone-800">
                      {col.label}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${col.countColor}`}>
                      {itemsInCol.length}
                    </span>
                  </div>
                </div>

                {/* Column Cards / Empty State */}
                <div className="space-y-3 flex-1">
                  {itemsInCol.length === 0 ? (
                    <div className="text-center py-12 px-3 rounded-2xl border border-dashed border-stone-200 text-stone-400 text-xs">
                      <p className="font-semibold">No scholarships</p>
                      <p className="text-[11px] mt-1 text-stone-400">
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
                          className={`bg-white rounded-2xl border p-4 shadow-2xs hover:shadow-sm transition-all cursor-grab active:cursor-grabbing space-y-3 ${
                            draggedId === sch.id ? 'opacity-40 scale-95 border-dashed border-stone-400' : 'border-stone-200/90'
                          }`}
                          aria-label={`Scholarship ${sch.name}, status ${item.status}`}
                        >
                          {/* Top provider & remove */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 truncate">
                              {sch.provider}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromTracker(sch.id)}
                              className="text-stone-300 hover:text-rose-600 p-1 rounded-md transition-colors"
                              title="Remove from tracker"
                              aria-label={`Remove ${sch.name} from tracker`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Scheme Name */}
                          <Link
                            to={`/scholarship/${sch.id}`}
                            className="text-sm font-bold text-stone-900 hover:text-[#133E2B] transition-colors leading-snug block"
                          >
                            {sch.name}
                          </Link>

                          {/* Award Amount */}
                          <div className="text-base font-extrabold text-[#133E2B]">
                            {sch.amountFormatted}
                          </div>

                          {/* Deadline countdown */}
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold text-[11px] ${
                              deadlineInfo.isCritical 
                                ? 'bg-rose-100 text-rose-800' 
                                : deadlineInfo.isUrgent 
                                ? 'bg-amber-100 text-amber-900' 
                                : 'bg-stone-100 text-stone-700'
                            }`}>
                              <Clock className="w-3 h-3" />
                              {deadlineInfo.text}
                            </span>
                          </div>

                          {/* Documents Checklist Progress */}
                          <div className="pt-2 border-t border-stone-100 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-stone-500 font-semibold flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Documents
                              </span>
                              <span className="font-bold text-stone-700">
                                {checkedDocsCount} / {docsForSch.length}
                              </span>
                            </div>
                            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#133E2B] h-full rounded-full transition-all duration-300"
                                style={{ width: `${docPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Editable Note Section */}
                          <div className="pt-2 border-t border-stone-100">
                            {isEditingThisNote ? (
                              <div className="space-y-1.5">
                                <textarea
                                  value={noteText}
                                  onChange={(e) => setNoteText(e.target.value)}
                                  placeholder="Add interview dates, application notes, or token numbers..."
                                  rows={2}
                                  className="w-full p-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#133E2B] bg-stone-50"
                                  autoFocus
                                />
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setEditingNoteId(null)}
                                    className="px-2 py-1 text-[11px] text-stone-500 hover:text-stone-800"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveNote(sch.id)}
                                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-[#133E2B] text-white rounded-md"
                                  >
                                    <Check className="w-3 h-3" /> Save
                                  </button>
                                </div>
                              </div>
                            ) : item.notes ? (
                              <div 
                                onClick={() => handleStartEditNote(sch.id, item.notes)}
                                className="group p-2 rounded-lg bg-stone-50 hover:bg-stone-100/70 cursor-pointer border border-stone-200/60 text-[11px] text-stone-600 flex items-start justify-between gap-1"
                                title="Click to edit note"
                              >
                                <span className="italic leading-tight">{item.notes}</span>
                                <Edit3 className="w-3 h-3 text-stone-400 group-hover:text-stone-700 shrink-0 mt-0.5" />
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleStartEditNote(sch.id)}
                                className="text-[11px] text-stone-400 hover:text-stone-700 flex items-center gap-1 font-semibold"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Add personal note</span>
                              </button>
                            )}
                          </div>

                          {/* Status dropdown for Touch / Keyboard Accessibility */}
                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                            <label htmlFor={`status-select-${sch.id}`} className="text-[10px] font-bold text-stone-400 uppercase">
                              Move to:
                            </label>
                            <select
                              id={`status-select-${sch.id}`}
                              value={item.status}
                              onChange={(e) => setTrackerStatus(sch.id, e.target.value as TrackerStatus)}
                              className="text-xs font-bold text-stone-700 bg-stone-100 border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#133E2B]"
                            >
                              <option value="saved">Saved</option>
                              <option value="applying">Applying</option>
                              <option value="submitted">Submitted</option>
                              <option value="awarded">Awarded</option>
                              <option value="rejected">Rejected</option>
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
