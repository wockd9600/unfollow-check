import { GROUP_LABELS, type GroupKey } from './classify';

const PAGE_SIZE = 200;
const COPY_FEEDBACK_MS = 1600;
const PROFILE_URL = 'https://x.com/i/user/';

const fmt = (n: number) => n.toLocaleString('ko-KR');

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function row(id: string): HTMLLIElement {
  const li = el('li');
  const a = el('a', 'row');
  a.href = PROFILE_URL + encodeURIComponent(id);
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.setAttribute('aria-label', `계정 ${id} 프로필 열기`);
  a.append(el('span', 'row-id', id), el('span', 'row-go', '프로필 ↗'));
  li.append(a);
  return li;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** One collapsible result card. Owns its own open state and pagination. */
export function buildGroup(key: GroupKey, ids: readonly string[]): HTMLElement {
  const { title, hint } = GROUP_LABELS[key];
  const section = el('section', `group group-${key}`);
  section.dataset.key = key;

  const panelId = `panel-${key}`;
  const head = el('button', 'group-head');
  head.type = 'button';
  head.setAttribute('aria-expanded', 'false');
  head.setAttribute('aria-controls', panelId);
  head.disabled = ids.length === 0;

  const count = el('span', 'group-count', fmt(ids.length));
  const text = el('span', 'group-text');
  text.append(el('span', 'group-title', title), el('span', 'group-hint', ids.length ? hint : '해당하는 계정이 없어요'));
  const chevron = el('span', 'group-chevron');
  chevron.setAttribute('aria-hidden', 'true');
  head.append(count, text, chevron);

  const panel = el('div', 'group-panel');
  panel.id = panelId;
  panel.hidden = true;

  const toolbar = el('div', 'panel-bar');
  toolbar.append(el('span', 'panel-note', '누르면 프로필이 열려요'));
  const copy = el('button', 'ghost small', 'ID 전체 복사');
  copy.type = 'button';
  toolbar.append(copy);

  const list = el('ul', 'rows');
  const more = el('button', 'more');
  more.type = 'button';
  panel.append(toolbar, list, more);

  let shown = 0;
  const showMore = () => {
    const next = Math.min(shown + PAGE_SIZE, ids.length);
    const frag = document.createDocumentFragment();
    ids.slice(shown, next).forEach((id) => frag.append(row(id)));
    list.append(frag);
    shown = next;
    const rest = ids.length - shown;
    more.hidden = rest <= 0;
    more.textContent = `${fmt(Math.min(rest, PAGE_SIZE))}개 더 보기 · 남은 ${fmt(rest)}개`;
  };

  head.addEventListener('click', () => {
    const open = head.getAttribute('aria-expanded') !== 'true';
    head.setAttribute('aria-expanded', String(open));
    section.classList.toggle('open', open);
    if (open && shown === 0) showMore();
    panel.hidden = !open;
  });

  more.addEventListener('click', showMore);

  copy.addEventListener('click', async () => {
    const ok = await copyText(ids.join('\n'));
    copy.textContent = ok ? `${fmt(ids.length)}개 복사됨` : '복사가 막혀 있어요';
    window.setTimeout(() => (copy.textContent = 'ID 전체 복사'), COPY_FEEDBACK_MS);
  });

  section.append(head, panel);
  return section;
}

export function buildChip(key: GroupKey, checked: boolean, count: number, onChange: (key: GroupKey, on: boolean) => void): HTMLLabelElement {
  const label = el('label', 'chip');
  const input = el('input');
  input.type = 'checkbox';
  input.checked = checked;
  input.value = key;
  input.addEventListener('change', () => onChange(key, input.checked));
  label.append(input, el('span', 'chip-text', GROUP_LABELS[key].title), el('span', 'chip-count', fmt(count)));
  return label;
}

export { fmt };
