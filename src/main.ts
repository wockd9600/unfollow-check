import './styles/tokens.css';
import './styles/app.css';
import { ArchiveError, readArchive, type Archive } from './archive';
import { GROUP_KEYS, classify, type GroupKey, type Groups } from './classify';
import { loadVisible, saveVisible } from './prefs';
import { buildChip, buildGroup, fmt } from './render';
import { setupInstall } from './install';
import { setupOnboarding } from './onboarding';

interface State {
  readonly groups: Groups | null;
  readonly visible: readonly GroupKey[];
}

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const ui = {
  upload: $('upload'),
  drop: $<HTMLLabelElement>('drop'),
  dropTitle: $('drop-title'),
  file: $<HTMLInputElement>('file'),
  error: $('error'),
  loaded: $('loaded'),
  loadedStats: $('loaded-stats'),
  reset: $<HTMLButtonElement>('reset'),
  groups: $('groups'),
  options: $<HTMLFieldSetElement>('options'),
  chips: $('chips'),
};

let state: State = { groups: null, visible: loadVisible() };

function applyVisibility(): void {
  ui.groups.querySelectorAll<HTMLElement>('.group').forEach((g) => {
    g.hidden = !state.visible.includes(g.dataset.key as GroupKey);
  });
}

function setVisible(key: GroupKey, on: boolean): void {
  const next = GROUP_KEYS.filter((k) => (k === key ? on : state.visible.includes(k)));
  if (next.length === 0) {
    // Keep at least one list on screen; undo the uncheck.
    const input = ui.chips.querySelector<HTMLInputElement>(`input[value="${key}"]`);
    if (input) input.checked = true;
    return;
  }
  state = { ...state, visible: next };
  saveVisible(next);
  applyVisibility();
}

function showResult(archive: Archive): void {
  const groups = classify(archive);
  state = { ...state, groups };

  ui.loadedStats.textContent = `팔로워 ${fmt(archive.followers.length)} · 팔로잉 ${fmt(archive.following.length)}`;
  ui.groups.replaceChildren(...GROUP_KEYS.map((k) => buildGroup(k, groups[k])));
  ui.chips.replaceChildren(...GROUP_KEYS.map((k) => buildChip(k, state.visible.includes(k), groups[k].length, setVisible)));
  applyVisibility();

  ui.upload.hidden = true;
  ui.loaded.hidden = false;
  ui.groups.hidden = false;
  ui.options.hidden = false;
  ui.groups.querySelector<HTMLButtonElement>('.group:not([hidden]) .group-head')?.focus({ preventScroll: true });
}

function showError(message: string): void {
  ui.error.textContent = message;
  ui.error.hidden = false;
}

async function handleFiles(files: readonly File[]): Promise<void> {
  if (!files.length) return;
  ui.error.hidden = true;
  ui.drop.classList.add('busy');
  ui.drop.setAttribute('aria-busy', 'true');
  ui.dropTitle.textContent = '읽는 중…';
  try {
    showResult(await readArchive(files));
  } catch (e) {
    console.error('[unfollow-check] failed to read archive', e);
    showError(e instanceof ArchiveError ? e.message : '파일을 읽는 중 문제가 생겼어요. 다시 시도해 주세요.');
  } finally {
    ui.drop.classList.remove('busy');
    ui.drop.removeAttribute('aria-busy');
    ui.dropTitle.textContent = 'zip 파일 선택';
  }
}

function reset(): void {
  state = { ...state, groups: null };
  ui.groups.replaceChildren();
  ui.groups.hidden = true;
  ui.options.hidden = true;
  ui.loaded.hidden = true;
  ui.upload.hidden = false;
  ui.error.hidden = true;
  ui.file.focus();
}

ui.file.addEventListener('change', () => {
  const files = [...(ui.file.files ?? [])];
  ui.file.value = '';
  void handleFiles(files);
});

ui.reset.addEventListener('click', reset);

// Drag and drop (desktop). Dropping outside the zone must not navigate away.
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', (e) => e.preventDefault());
ui.drop.addEventListener('dragenter', () => ui.drop.classList.add('drag'));
ui.drop.addEventListener('dragleave', (e) => {
  if (!ui.drop.contains(e.relatedTarget as Node | null)) ui.drop.classList.remove('drag');
});
ui.drop.addEventListener('drop', (e) => {
  ui.drop.classList.remove('drag');
  void handleFiles([...(e.dataTransfer?.files ?? [])]);
});

setupInstall();
setupOnboarding();

// Dev only: floating bar to jump straight to the result screen (`?demo` too).
if (import.meta.env.DEV) {
  void import('./dev').then(({ setupDev }) => setupDev(showResult));
}
