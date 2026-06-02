import { STAGE_ORDER } from "../constants";

export default function TaskCard({ task, onMove, onEdit, onDelete, busy }) {
  const idx = STAGE_ORDER.indexOf(task.stage);
  const canPrev = idx > 0;
  const canNext = idx < STAGE_ORDER.length - 1;

  return (
    <article className={`task ${task.stage}`}>
      <h4>{task.title}</h4>
      {task.description && <p>{task.description}</p>}

      <div className="task-foot">
        <div className="move-group">
          <button
            className="icon-btn"
            title="Move back"
            disabled={!canPrev || busy}
            onClick={() => onMove(task, STAGE_ORDER[idx - 1])}
          >
            ←
          </button>
          <button
            className="icon-btn"
            title="Move forward"
            disabled={!canNext || busy}
            onClick={() => onMove(task, STAGE_ORDER[idx + 1])}
          >
            →
          </button>
        </div>
        <div className="task-actions">
          <button
            className="icon-btn"
            title="Edit"
            disabled={busy}
            onClick={() => onEdit(task)}
          >
            ✎
          </button>
          <button
            className="icon-btn danger"
            title="Delete"
            disabled={busy}
            onClick={() => onDelete(task)}
          >
            ✕
          </button>
        </div>
      </div>
    </article>
  );
}
