import React, { useState, useEffect } from 'react';
import { ProjectNote, ProjectMilestone } from '../types';
import { MessageSquare, Plus, Pin, PinOff, Pencil, Check, Trash2, X } from 'lucide-react';

interface ProjectNotesSectionProps {
  notes: ProjectNote[];
  milestones: ProjectMilestone[];
  onAddNote: (newNote: Omit<ProjectNote, 'id'>) => void;
  onEditNote?: (updatedNote: ProjectNote) => void;
  onTogglePinNote?: (noteId: string, targetPinned?: boolean) => void;
  onDeleteNote: (noteId: string) => void;
  onToggleMilestone?: (milestoneId: string) => void;
}

export const ProjectNotesSection: React.FC<ProjectNotesSectionProps> = ({
  notes,
  milestones,
  onAddNote,
  onEditNote,
  onTogglePinNote,
  onDeleteNote,
  onToggleMilestone,
}) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [author, setAuthor] = useState<string>('Raul Recalde');
  const [category, setCategory] = useState<ProjectNote['category']>('General Context');
  const [text, setText] = useState<string>('');
  const [isPinned, setIsPinned] = useState<boolean>(false);

  // Optimistic local state for immediate 0ms responsiveness
  const [localNotes, setLocalNotes] = useState<ProjectNote[]>(notes);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  // Inline editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [editAuthor, setEditAuthor] = useState<string>('');
  const [editCategory, setEditCategory] = useState<ProjectNote['category']>('General Context');
  const [editIsPinned, setEditIsPinned] = useState<boolean>(false);

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

  const handleTogglePin = (e: React.MouseEvent, note: ProjectNote) => {
    e.preventDefault();
    e.stopPropagation();
    const nextPinned = !Boolean(note.isPinned);

    // 1. Optimistic update in local state for instantaneous feedback
    setLocalNotes((prev) =>
      prev.map((n) => (n.id === note.id ? { ...n, isPinned: nextPinned } : n))
    );

    // 2. Propagate to parent state & backend
    if (onTogglePinNote) {
      onTogglePinNote(note.id, nextPinned);
    } else if (onEditNote) {
      onEditNote({
        ...note,
        isPinned: nextPinned,
      });
    }
  };

  const startEditingNote = (note: ProjectNote) => {
    setEditingNoteId(note.id);
    setEditText(note.text);
    setEditAuthor(note.author);
    setEditCategory(note.category);
    setEditIsPinned(Boolean(note.isPinned));
  };

  const cancelEditingNote = () => {
    setEditingNoteId(null);
    setEditText('');
    setEditAuthor('');
  };

  const handleSaveEdit = (noteId: string) => {
    if (!editText.trim()) return;
    const original = localNotes.find((n) => n.id === noteId);
    if (!original) return;

    const hasContentChanged =
      editText.trim() !== original.text ||
      editCategory !== original.category ||
      editAuthor.trim() !== original.author ||
      Boolean(editIsPinned) !== Boolean(original.isPinned);

    let timestamp = original.timestamp;
    if (hasContentChanged && !timestamp.includes('(edited)')) {
      timestamp = `${timestamp} (edited)`;
    }

    const updated: ProjectNote = {
      ...original,
      author: editAuthor.trim() || original.author,
      category: editCategory,
      text: editText.trim(),
      isPinned: editIsPinned,
      timestamp,
    };

    // Optimistic local update
    setLocalNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));

    if (onEditNote) {
      onEditNote(updated);
    }
    setEditingNoteId(null);
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

  // Sort notes: pinned notes first, then chronological
  const sortedNotes = [...localNotes].sort((a, b) => {
    const aPinned = Boolean(a.isPinned);
    const bPinned = Boolean(b.isPinned);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
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
                <span className="flex items-center gap-1 font-semibold text-amber-900">
                  <Pin className="w-3.5 h-3.5 rotate-45" /> Pin as Priority Alert
                </span>
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
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Post Note
            </button>
          </div>
        </form>
      )}

      {/* Notes Feed */}
      <div className="mt-4 space-y-3">
        {sortedNotes.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No notes recorded for this project yet. Add notes to keep installers and management in sync.
          </div>
        ) : (
          sortedNotes.map((note) => {
            const isNotePinned = Boolean(note.isPinned);
            const isPostItNote = Boolean(
              note.isPostIt ||
              note.postItLogId ||
              note.id.startsWith('note-postit-') ||
              note.text.startsWith('📌 Post-It Note')
            );

            return (
              <div
                key={note.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  isNotePinned
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Note Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                  <div className="flex items-center gap-2">
                    {/* Primary Interactive Pin/Unpin Status Badge */}
                    {isNotePinned ? (
                      <button
                        type="button"
                        onClick={(e) => handleTogglePin(e, note)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 active:scale-95 border border-amber-300 rounded-md transition-all shadow-2xs cursor-pointer group"
                        title="Click to unpin this note"
                      >
                        <Pin className="w-3.5 h-3.5 text-amber-700 fill-amber-700 rotate-45 group-hover:scale-110 transition-transform" />
                        <span>Pinned Priority</span>
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-200/80 px-1.5 py-0.2 rounded border border-amber-300/60 ml-0.5 group-hover:bg-amber-300 transition-colors">
                          Unpin
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleTogglePin(e, note)}
                        className="inline-flex items-center gap-1 text-[10.5px] font-medium text-slate-500 hover:text-amber-800 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded px-2 py-0.5 transition-all cursor-pointer group"
                        title="Pin note as priority alert"
                      >
                        <Pin className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 rotate-45" />
                        <span>Pin</span>
                      </button>
                    )}

                    <span className="font-bold text-slate-900">{note.author}</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-slate-500 text-[11px]">{note.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isPostItNote && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                        <span>📌 BOM Post-It</span>
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryColor(
                        note.category
                      )}`}
                    >
                      {note.category}
                    </span>

                    {/* Dedicated Unpin / Pin Action Button */}
                    <button
                      type="button"
                      onClick={(e) => handleTogglePin(e, note)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                        isNotePinned
                          ? 'text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300'
                          : 'text-slate-500 hover:text-amber-800 hover:bg-amber-50 border border-slate-200'
                      }`}
                      title={isNotePinned ? 'Unpin note' : 'Pin note as priority alert'}
                    >
                      {isNotePinned ? (
                        <>
                          <PinOff className="w-3.5 h-3.5 text-amber-700" />
                          <span>Unpin</span>
                        </>
                      ) : (
                        <>
                          <Pin className="w-3.5 h-3.5 text-slate-400 rotate-45" />
                          <span>Pin</span>
                        </>
                      )}
                    </button>

                    {editingNoteId !== note.id && (
                      <button
                        type="button"
                        onClick={() => startEditingNote(note)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors cursor-pointer"
                        title="Edit note"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Note Body or Inline Edit Form */}
                {editingNoteId === note.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveEdit(note.id);
                    }}
                    className="mt-2 p-3 bg-white border border-sky-300 rounded-lg space-y-3 shadow-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Author</label>
                        <input
                          type="text"
                          required
                          value={editAuthor}
                          onChange={(e) => setEditAuthor(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">Category</label>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as ProjectNote['category'])}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-sky-500"
                        >
                          <option value="General Context">General Context</option>
                          <option value="Site Access & Keys">Site Access & Keys</option>
                          <option value="Hardware Delivery">Hardware Delivery</option>
                          <option value="Inspection & Commissioning">Inspection & Commissioning</option>
                          <option value="Resident Notice">Resident Notice</option>
                        </select>
                      </div>
                      <div className="flex items-end pb-1">
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium">
                          <input
                            type="checkbox"
                            checked={editIsPinned}
                            onChange={(e) => setEditIsPinned(e.target.checked)}
                            className="w-4 h-4 rounded text-amber-600 bg-white border-slate-300 focus:ring-0"
                          />
                          <span className="flex items-center gap-1 font-semibold text-amber-900">
                            <Pin className="w-3.5 h-3.5 rotate-45" /> Pinned as Priority
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1 text-xs">Note Context & Details</label>
                      <textarea
                        rows={3}
                        required
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={cancelEditingNote}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-[0.98] rounded-lg transition-colors shadow-xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-xs text-slate-700 leading-relaxed pl-0.5 whitespace-pre-wrap">{note.text}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
