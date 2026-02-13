import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getRecentProjectIds, addRecentProjectId, removeRecentProjectId } from './recentProjects';

const KEY = 'glassheet-recent';

describe('recentProjects', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    });
  });

  describe('getRecentProjectIds', () => {
    it('returns empty array when no storage', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      expect(getRecentProjectIds()).toEqual([]);
    });
    it('returns parsed array from storage', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(['a', 'b']));
      expect(getRecentProjectIds()).toEqual(['a', 'b']);
    });
    it('returns empty array for invalid JSON', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('not json');
      expect(getRecentProjectIds()).toEqual([]);
    });
    it('returns empty array when stored value is not array', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue('{}');
      expect(getRecentProjectIds()).toEqual([]);
    });
    it('caps at 10 items', () => {
      const ids = Array.from({ length: 15 }, (_, i) => `id-${i}`);
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(ids));
      expect(getRecentProjectIds().length).toBe(10);
      expect(getRecentProjectIds()[0]).toBe('id-0');
    });
  });

  describe('addRecentProjectId', () => {
    it('adds id to empty list', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
      addRecentProjectId('new-id');
      expect(localStorage.setItem).toHaveBeenCalledWith(KEY, JSON.stringify(['new-id']));
    });
    it('moves existing id to front', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(['a', 'b', 'c']));
      addRecentProjectId('b');
      expect(localStorage.setItem).toHaveBeenCalledWith(KEY, JSON.stringify(['b', 'a', 'c']));
    });
    it('does not duplicate when id already first', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(['x']));
      addRecentProjectId('x');
      expect(localStorage.setItem).toHaveBeenCalledWith(KEY, JSON.stringify(['x']));
    });
  });

  describe('removeRecentProjectId', () => {
    it('removes id from list', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(['a', 'b', 'c']));
      removeRecentProjectId('b');
      expect(localStorage.setItem).toHaveBeenCalledWith(KEY, JSON.stringify(['a', 'c']));
    });
    it('no-op when id not in list', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(JSON.stringify(['a']));
      removeRecentProjectId('z');
      expect(localStorage.setItem).toHaveBeenCalledWith(KEY, JSON.stringify(['a']));
    });
  });
});
