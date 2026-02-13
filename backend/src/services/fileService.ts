import fs from 'node:fs/promises';
import path from 'node:path';
import { PROJECTS_DIR, PROJECT_EXT } from '../config.js';

export interface ProjectMeta {
  id: string;
  name: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  sheets: { name: string; data: (string | number | null)[][] }[];
  createdAt?: string;
  updatedAt?: string;
}

function projectPath(projectId: string): string {
  const safe = projectId.replace(/[^a-zA-Z0-9-_]/g, '');
  if (!safe) throw new Error('Invalid project id');
  return path.join(PROJECTS_DIR, `${safe}${PROJECT_EXT}`);
}

export async function ensureProjectsDir(): Promise<void> {
  await fs.mkdir(PROJECTS_DIR, { recursive: true });
}

export async function listProjects(): Promise<ProjectMeta[]> {
  await ensureProjectsDir();
  const entries = await fs.readdir(PROJECTS_DIR, { withFileTypes: true });
  const projects: ProjectMeta[] = [];
  for (const e of entries) {
    if (!e.isFile() || !e.name.endsWith(PROJECT_EXT)) continue;
    const id = e.name.slice(0, -PROJECT_EXT.length);
    try {
      const p = await readProject(id);
      projects.push({
        id,
        name: p.name,
        updatedAt: p.updatedAt,
      });
    } catch {
      // skip corrupted files
    }
  }
  return projects;
}

export async function readProject(projectId: string): Promise<Project> {
  const filePath = projectPath(projectId);
  const raw = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(raw) as Project;
  if (!data.id || !data.sheets) throw new Error('Invalid project file');
  return data;
}

export async function writeProject(project: Project): Promise<void> {
  await ensureProjectsDir();
  const filePath = projectPath(project.id);
  const withMeta = {
    ...project,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(
    filePath,
    JSON.stringify(withMeta, null, 2),
    'utf-8'
  );
}

export async function deleteProject(projectId: string): Promise<void> {
  const filePath = projectPath(projectId);
  await fs.unlink(filePath);
}
