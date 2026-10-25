import React, { useState } from 'react';
import { ProjectNote, ProjectMilestone } from '../types';
import { MessageSquare, Plus, Pin, CheckCircle2, Clock, Calendar, ShieldCheck } from 'lucide-react';

interface ProjectNotesSectionProps {
  notes: ProjectNote[];
  milestones: ProjectMilestone[];
  onAddNote: (newNote: Omit<ProjectNote, 'id'>) => void;
  onDeleteNote: (noteId: string) => void;
  onToggleMilestone?: (milestoneId: string) => void;
}

export const ProjectNotesSection: React.FC<ProjectNotesSectionProps> = ({
  notes,
  milestones,
  onAddNote,
  onDeleteNote,
  onToggleMilestone,
}) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [author, setAuthor] = useState<string>('Raul Recalde');
  const [category, setCategory] = useState<ProjectNote['category']>('General Context');
  const [text, setText] = useState<string>('');
  const [isPinned, setIsPinned] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const now = new Date();
    const timestamp = `${now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} ${now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    onAddNote({
      projectId: '',
      author: author.trim() || 'Project Manager',
      timestamp,
      category,
      text: text.trim(),
      isPinned,
    });

    setText('');
    setIsPinned(false);
    setShowAddForm(false);
  };

  const getCategoryColor = (cat: ProjectNote['category']) => {
    switch (cat) {
      case 'General Context':
        return 'text-sky-700 border-sky-300 bg-sky-50';
      case 'Site Access & Keys':
        return 'text-amber-800 border-amber-300 bg-amber-50';
      case 'Hardware Delivery':
        return 'text-purple-700 border-purple-300 bg-purple-50';
      case 'Inspection & Commissioning':
        return 'text-emerald-700 border-emerald-300 bg-emerald-50';
      case 'Resident Notice':
        return 'text-rose-700 border-rose-300 bg-rose-50';
      default:
        return 'text-slate-700 border-slate-300 bg-slate-100';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">General Project Notes & Operations Context</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Document field updates, site constraints, delivery milestones, and coordination context.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-sky-600" />
          <span>{showAddForm ? 'Cancel' : 'Add Note'}</span>
        </button>
      </div>

      {/* Add Note Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Author</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectNote['category'])}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500"
              >
                <option value="General Context">General Context</option>
                <option value="Site Access & Keys">Site Access & Keys</option>
                <option value="Hardware Delivery">Hardware Delivery</option>
                <option value="Inspection & Commissioning">Inspection & Commissioning</option>
                <option value="Resident Notice">Resident Notice</option>
              </select>
            </div>

            <div className="flex items-end pb-1.5">
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 bg-white border-slate-300 focus:ring-0"
                />
                <span>Pin as Priority Alert</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 text-xs">Note Context & Details</label>
            <textarea
              rows={3}
              required
              placeholder="Write operational details, subcontractor coordination status, or site notes..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs"
            >
              Post Note
            </button>
          </div>
        </form>
      )}

      {/* Notes Feed */}
      <div className="mt-4 space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No notes recorded for this project yet. Add notes to keep installers and management in sync.
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`p-3.5 rounded-lg border transition-all ${
                note.isPinned
                  ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  {note.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800">
                      <Pin className="w-3 h-3 rotate-45" /> Pinned
                    </span>
                  )}
                  <span className="font-bold text-slate-900">{note.author}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-mono text-slate-500 text-[11px]">{note.timestamp}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryColor(
                      note.category
                    )}`}
                  >
                    {note.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteNote(note.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Delete note"
                  >
                    &times;
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed pl-0.5">{note.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

