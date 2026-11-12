import type { Archive } from './archive';
import './styles/dev.css';

// Dev-only tools. Loaded via dynamic import behind `import.meta.env.DEV`,
// so neither this module nor its CSS ships in the production bundle.

// Sizes are chosen so one group exceeds a page (200) and exercises "더 보기".
const BASE_ID = 1_400_000_000_000_000_000n;
const ID_STEP = 7919n;
const FOLLOWING_RANGE = [0, 180] as const;
const FOLLOWER_RANGE = [100, 420] as const;

const ids = ([from, to]: readonly [number, number]): string[] =>
  Array.from({ length: to - from }, (_, i) => String(BASE_ID + BigInt(from + i) * ID_STEP));

const SAMPLE_ARCHIVE: Archive = {
  following: ids(FOLLOWING_RANGE),
  followers: ids(FOLLOWER_RANGE),
};

/** Floating dev bar with a shortcut to the result screen. `?demo` opens it on load. */
export function setupDev(showResult: (archive: Archive) => void): void {
  const bar = document.createElement('aside');
  bar.className = 'dev-bar';
  bar.setAttribute('aria-label', '개발용 도구');

  const tag = document.createElement('span');
  tag.className = 'dev-bar-tag';
  tag.textContent = 'DEV';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = '샘플 결과';
  button.addEventListener('click', () => showResult(SAMPLE_ARCHIVE));

  bar.append(tag, button);
  document.body.append(bar);

  if (new URLSearchParams(location.search).has('demo')) showResult(SAMPLE_ARCHIVE);
}
