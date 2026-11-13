/** "홈 화면에 추가" card in the wait step: native install prompt where supported, written steps everywhere else. */

import { isIos, isIosChrome } from './platform';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type InstallMode = 'prompt' | 'ios' | 'iosChrome' | 'inapp' | 'manual';

const IN_APP_PATTERN = /KAKAOTALK|Instagram|FBAN|FBAV|Line\/|NAVER\(inapp|Twitter|DaumApps|everytimeApp/i;

/** Placeholder in guide text that is replaced with the iOS share icon. */
const SHARE_TOKEN = '{share}';
const SVG_NS = 'http://www.w3.org/2000/svg';
const SHARE_ICON_PATH = 'M12 15V3.5m0 0-4 4m4-4 4 4M8 10.5H6.5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H16';

function buildShareIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'guide-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', SHARE_ICON_PATH);
  svg.append(path);
  return svg;
}

/** Splits a guide step on the share token, putting the icon where the token was. */
function buildStepContent(text: string): (string | SVGSVGElement)[] {
  return text.split(SHARE_TOKEN).flatMap((part, i) => (i === 0 ? [part] : [buildShareIcon(), part]));
}

const GUIDES: Readonly<Record<Exclude<InstallMode, 'prompt'>, readonly string[]>> = {
  ios: [
    'Safari 주소창 옆의 {share} 공유 버튼을 눌러요. 안 보이면 ⋯ 를 먼저 눌러요.',
    '메뉴를 내려서 "홈 화면에 추가"를 눌러요.',
    '오른쪽 위 "추가"를 누르면 홈 화면에 아이콘이 생겨요.',
  ],
  iosChrome: [
    'Chrome 주소창 오른쪽의 {share} 공유 버튼을 눌러요.',
    '목록을 아래로 내려서 "홈 화면에 추가"를 눌러요.',
    '오른쪽 위 "추가"를 누르면 홈 화면에 아이콘이 생겨요.',
  ],
  inapp: [
    '카카오톡·인스타그램 같은 앱 안의 브라우저에서는 홈 화면에 추가할 수 없어요.',
    '오른쪽 위나 아래의 ⋯ 메뉴에서 "다른 브라우저로 열기"(아이폰은 "Safari로 열기")를 눌러요.',
    '열린 Safari나 Chrome에서 이 버튼을 다시 눌러 주세요.',
  ],
  manual: [
    '브라우저 메뉴(⋮ 또는 ⋯)에서 "홈 화면에 추가"나 "앱 설치"를 눌러요.',
    '메뉴에 없다면 이 페이지를 즐겨찾기(북마크)에 추가해 두세요.',
  ],
};

function isStandalone(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return iosStandalone || window.matchMedia('(display-mode: standalone)').matches;
}

function detectMode(): InstallMode {
  if (isInApp()) return 'inapp';
  if (!isIos()) return 'manual';
  return isIosChrome() ? 'iosChrome' : 'ios';
}

const isInApp = (): boolean => IN_APP_PATTERN.test(navigator.userAgent);

export function setupInstall(): void {
  const section = document.getElementById('install');
  const button = document.getElementById('install-btn') as HTMLButtonElement | null;
  const guide = document.getElementById('install-guide') as HTMLOListElement | null;
  if (!section || !button || !guide || isStandalone()) return;

  let deferred: BeforeInstallPromptEvent | null = null;
  // 'manual' until the browser offers a native prompt, so the card never silently disappears.
  let mode: InstallMode = detectMode();

  const hide = () => {
    section.hidden = true;
  };
  const closeGuide = () => {
    guide.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    button.textContent = '추가하기';
  };

  const renderGuide = (steps: readonly string[]) => {
    guide.replaceChildren(
      ...steps.map((text) => {
        const li = document.createElement('li');
        li.append(...buildStepContent(text));
        return li;
      }),
    );
  };

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    if (mode === 'inapp') return;
    mode = 'prompt';
    closeGuide();
  });
  window.addEventListener('appinstalled', hide);

  button.addEventListener('click', async () => {
    if (mode === 'prompt' && deferred) {
      const event = deferred;
      deferred = null;
      try {
        await event.prompt();
        const { outcome } = await event.userChoice;
        if (outcome === 'accepted') hide();
      } catch (err) {
        console.error('[unfollow-check] install prompt failed', err);
      }
      return;
    }
    if (mode === 'prompt') mode = 'manual';
    if (!guide.hidden) {
      closeGuide();
      return;
    }
    renderGuide(GUIDES[mode]);
    guide.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    button.textContent = '닫기';
  });

  section.hidden = false;
}
