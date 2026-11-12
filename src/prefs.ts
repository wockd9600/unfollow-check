import { GROUP_KEYS, type GroupKey } from './classify';

const STORE_KEY = 'unfollow-check:visible-groups';
const DEFAULT_VISIBLE: readonly GroupKey[] = ['onlyMe'];

const isGroupKey = (v: unknown): v is GroupKey => typeof v === 'string' && (GROUP_KEYS as readonly string[]).includes(v);

/** Per-viewer convenience only; storage may be unavailable (private mode), so fall back to defaults. */
export function loadVisible(): readonly GroupKey[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORE_KEY) ?? 'null');
    if (Array.isArray(raw)) {
      const keys = GROUP_KEYS.filter((k) => raw.filter(isGroupKey).includes(k));
      if (keys.length) return keys;
    }
  } catch {
    /* storage unavailable or corrupted: use defaults */
  }
  return DEFAULT_VISIBLE;
}

export function saveVisible(keys: readonly GroupKey[]): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(keys));
  } catch {
    /* not persisted; the choice still applies for this visit */
  }
}
