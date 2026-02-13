const API = '/api';

function parseErrorResponse(res: Response): Promise<{ error?: string }> {
  return res.json().catch(() => ({ error: res.statusText || `Error ${res.status}` }));
}

function throwApiError(_res: Response, err: { error?: string }, fallback: string): never {
  throw new Error(err?.error && typeof err.error === 'string' ? err.error : fallback);
}

export interface ProjectRef {
  id: string;
  name: string;
}

export interface SheetRef {
  name: string;
  data: (string | number | null)[][];
}

export interface UploadResponse {
  project: ProjectRef;
  sheet: SheetRef;
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);
  let res: Response;
  try {
    res = await fetch(`${API}/upload`, { method: 'POST', body: form });
  } catch {
    throw new Error('Network error. Is the backend running?');
  }
  if (!res.ok) {
    const err = await parseErrorResponse(res);
    throwApiError(res, err, 'Upload failed');
  }
  return res.json();
}

export interface Project {
  id: string;
  name: string;
  sheets: { name: string; data: (string | number | null)[][] }[];
}

export interface ProjectMeta {
  id: string;
  name: string;
  updatedAt?: string;
}

export async function listProjects(): Promise<ProjectMeta[]> {
  let res: Response;
  try {
    res = await fetch(`${API}/projects`);
  } catch {
    throw new Error('Network error. Is the backend running?');
  }
  if (!res.ok) {
    const err = await parseErrorResponse(res);
    throwApiError(res, err, 'Failed to list projects');
  }
  const json = await res.json();
  const list = (json as { projects?: ProjectMeta[] }).projects;
  if (!Array.isArray(list)) throw new Error('Invalid response from server');
  return list;
}

export async function getProject(id: string): Promise<Project> {
  let res: Response;
  try {
    res = await fetch(`${API}/projects/${id}`);
  } catch {
    throw new Error('Network error. Is the backend running?');
  }
  if (!res.ok) {
    const err = await parseErrorResponse(res);
    throwApiError(res, err, 'Failed to load project');
  }
  const data = await res.json();
  if (!data || typeof data.sheets !== 'object') throw new Error('Invalid project data');
  return data as Project;
}

export async function saveProject(
  id: string,
  payload: { name?: string; sheets: { name: string; data: (string | number | null)[][] }[] }
): Promise<void> {
  const res = await fetch(`${API}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await parseErrorResponse(res);
    throwApiError(res, err, 'Save failed');
  }
}

export async function renameProject(id: string, name: string): Promise<void> {
  const res = await fetch(`${API}/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const err = await parseErrorResponse(res);
    throwApiError(res, err, 'Rename failed');
  }
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${API}/projects/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await parseErrorResponse(res);
    throwApiError(res, err, 'Delete failed');
  }
}

export async function exportSheet(
  format: 'xlsx' | 'csv',
  sheet: { name: string; data: (string | number | null)[][] }
): Promise<Blob> {
  const res = await fetch(`${API}/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ format, sheet }),
  });
  if (!res.ok) {
    const err = await parseErrorResponse(res);
    throwApiError(res, err, 'Export failed');
  }
  return res.blob();
}
