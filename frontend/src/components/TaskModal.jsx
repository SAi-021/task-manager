import { useEffect, useState } from "react";
import { STAGES } from "../constants";

export default function TaskModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial?.id);
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [stage, setStage] = useState(initial?.stage || "todo");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("A title is required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || null,
        stage,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <h3>{isEdit ? "Edit task" : "New task"}</h3>
        {error && <div className="banner error">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="t-title">Title</label>
            <input
              id="t-title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs doing?"
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="t-desc">Description</label>
            <textarea
              id="t-desc"
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details…"
            />
          </div>
          <div className="field">
            <label htmlFor="t-stage">Stage</label>
            <select
              id="t-stage"
              className="input"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-foot">
            <button type="button" className="btn ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn clay" disabled={saving}>
              {saving ? <span className="spinner" /> : null}
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
