import path from 'node:path';

const WORKSPACE_ENV = process.env.WORKSPACE;
export const WORKSPACE_DIR = path.resolve(
  WORKSPACE_ENV || path.join(process.cwd(), 'glassheet-workspace')
);
export const PROJECTS_DIR = path.join(WORKSPACE_DIR, 'projects');

export const PROJECT_EXT = '.gsheet';
