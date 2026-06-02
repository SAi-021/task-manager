import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { STAGES } from "../constants";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

export default function Board() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null); // task currently mutating
  const [modal, setModal] = useState(null); // null | {} (new) | task (edit)

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = useMemo(() => {
    const map = { todo: [], in_progress: [], done: [] };
    for (const t of tasks) (map[t.stage] ||= []).push(t);
    return map;
  }, [tasks]);

  const handleSave = async (payload) => {
    if (modal?.id) {
      const updated = await api.updateTask(modal.id, payload);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const created = await api.createTask(payload);
      setTasks((prev) => [created, ...prev]);
    }
    setModal(null);
  };

  const handleMove = async (task, nextStage) => {
    setBusyId(task.id);
    // optimistic
    const prev = tasks;
    setTasks((ts) =>
      ts.map((t) => (t.id === task.id ? { ...t, stage: nextStage } : t))
    );
    try {
      const updated = await api.updateTask(task.id, { stage: nextStage });
      setTasks((ts) => ts.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setTasks(prev); // rollback
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setBusyId(task.id);
    const prev = tasks;
    setTasks((ts) => ts.filter((t) => t.id !== task.id));
    try {
      await api.deleteTask(task.id);
    } catch (err) {
      setTasks(prev);
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="logo">Taskboard</span>
          <span className="" />
        </div>
        <div className="topbar-right">
          <span className="who">
            Hi, <b>{user?.name}</b>
          </span>
          <button className="btn ghost sm" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <div className="board-head">
        <div>
          <h2>Your board</h2>
          <p>Capture tasks and slide them from Todo to Done.</p>
        </div>
        <button className="btn clay" onClick={() => setModal({})}>
          + New task
        </button>
      </div>

      {error && (
        <div style={{ padding: "0 clamp(1rem,4vw,2.5rem)" }}>
          <div className="banner error" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{error}</span>
            <button className="btn ghost sm" onClick={load}>
              Retry
            </button>
          </div>
        </div>
      )}

      <section className="board">
        {STAGES.map((s) => (
          <div className="column" key={s.key}>
            <div className="col-head">
              <span className="col-title">
                <span className={`col-pill ${s.key}`} />
                {s.label}
              </span>
              <span className="col-count">
                {loading ? "–" : grouped[s.key].length}
              </span>
            </div>

            <div className="col-stack">
              {loading ? (
                <>
                  <div className="skeleton" />
                  <div className="skeleton" />
                </>
              ) : grouped[s.key].length === 0 ? (
                <div className="col-empty">Nothing here yet</div>
              ) : (
                grouped[s.key].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    busy={busyId === task.id}
                    onMove={handleMove}
                    onEdit={(t) => setModal(t)}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </section>

      {modal !== null && (
        <TaskModal
          initial={modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
