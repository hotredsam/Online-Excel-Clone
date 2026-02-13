import { useState, useEffect } from 'react';
import {
  listProjects,
  renameProject,
  deleteProject,
  type ProjectMeta,
} from '../api/client';
import { getRecentProjectIds } from '../utils/recentProjects';

interface ProjectsTabProps {
  onOpenProject: (projectId: string) => void | Promise<void>;
  onProjectDeleted?: (projectId: string) => void;
}

export function ProjectsTab({ onOpenProject, onProjectDeleted }: ProjectsTabProps) {
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listProjects();
      setProjects(list);
      setRecentIds(getRecentProjectIds());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpen = async (id: string) => {
    try {
      await onOpenProject(id);
      setRecentIds(getRecentProjectIds());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open');
    }
  };

  const handleRename = (p: ProjectMeta) => {
    setRenamingId(p.id);
    setRenameValue(p.name);
  };

  const submitRename = async () => {
    if (!renamingId || !renameValue.trim()) {
      setRenamingId(null);
      return;
    }
    try {
      await renameProject(renamingId, renameValue.trim());
      setRenamingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rename failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    try {
      await deleteProject(id);
      onProjectDeleted?.(id);
      await load();
      setRecentIds(getRecentProjectIds());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const recentProjects = recentIds
    .map((id) => projects.find((p) => p.id === id))
    .filter(Boolean) as ProjectMeta[];
  const otherProjects = projects.filter((p) => !recentIds.includes(p.id));

  if (error) return <section className="projects-tab" aria-labelledby="projects-heading"><h2 id="projects-heading" className="glass-title">Projects</h2><p className="error glass-muted" role="alert">{error}</p><button type="button" className="glass-btn glass-btn-primary" onClick={load}>Retry</button></section>;

  return (
    <section className="projects-tab" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="glass-title">Projects</h2>
      {loading ? (
        <div className="glass-loading" aria-busy="true" aria-live="polite">
          <span className="glass-loading-spinner" aria-hidden />
          <span>Loading…</span>
        </div>
      ) : (
        <>
      {recentProjects.length > 0 && (
        <section>
          <h3>Recent</h3>
          <ul className="project-list">
            {recentProjects.map((p) => (
              <li key={p.id} className="project-row glass-list-row">
                {renamingId === p.id ? (
                  <>
                    <input
                      type="text"
                      className="glass-input"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                      autoFocus
                    />
                    <button type="button" className="glass-btn" onClick={submitRename}>Save</button>
                    <button type="button" className="glass-btn glass-btn-ghost" onClick={() => setRenamingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span className="project-name">{p.name}</span>
                    <button type="button" className="glass-btn" onClick={() => handleOpen(p.id)}>Open</button>
                    <button type="button" className="glass-btn glass-btn-ghost" onClick={() => handleRename(p)}>Rename</button>
                    <button type="button" className="glass-btn glass-btn-ghost" onClick={() => handleDelete(p.id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      <section>
        <h3>{recentProjects.length > 0 ? 'All projects' : 'All'}</h3>
        <ul className="project-list">
          {otherProjects.map((p) => (
            <li key={p.id} className="project-row glass-list-row">
              {renamingId === p.id ? (
                <>
                  <input
                    type="text"
                    className="glass-input"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                    autoFocus
                  />
                  <button type="button" className="glass-btn" onClick={submitRename}>Save</button>
                  <button type="button" className="glass-btn glass-btn-ghost" onClick={() => setRenamingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span className="project-name">{p.name}</span>
                  <button type="button" className="glass-btn" onClick={() => handleOpen(p.id)}>Open</button>
                  <button type="button" className="glass-btn glass-btn-ghost" onClick={() => handleRename(p)}>Rename</button>
                  <button type="button" className="glass-btn glass-btn-ghost" onClick={() => handleDelete(p.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
      {projects.length === 0 && <p className="glass-muted">No projects yet. Upload a file from the Sheets tab.</p>}
        </>
      )}
    </section>
  );
}
