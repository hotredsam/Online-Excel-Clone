const KEY = 'glassheet-recent';
const MAX = 10;

export function getRecentProjectIds(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed.slice(0, MAX) : [];
  } catch {
    return [];
  }
}

export function addRecentProjectId(id: string): void {
  const current = getRecentProjectIds();
  const next = [id, ...current.filter((x) => x !== id)].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function removeRecentProjectId(id: string): void {
  const next = getRecentProjectIds().filter((x) => x !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
}
