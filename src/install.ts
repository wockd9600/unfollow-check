/** "Add to Home Screen" card in the wait step: native install prompt where supported, written steps everywhere else. */

import { t } from './i18n';
import type { AppKey } from './i18n/ko';
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

const GUIDES: Readonly<Record<Exclude<InstallMode, 'prompt'>, readonly AppKey[]>> = {
  ios: ['guide.ios.1', 'guide.ios.2', 'guide.ios.3'],
  iosChrome: ['guide.iosChrome.1', 'guide.iosChrome.2', 'guide.iosChrome.3'],
  inapp: ['guide.inapp.1', 'guide.inapp.2', 'guide.inapp.3'],
  manual: ['guide.manual.1', 'guide.manual.2'],
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
    button.textContent = t('install.add');
  };

  const renderGuide = (steps: readonly AppKey[]) => {
    guide.replaceChildren(
      ...steps.map((key) => {
        const li = document.createElement('li');
        li.append(...buildStepContent(t(key)));
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
    button.textContent = t('install.close');
  });

  section.hidden = false;
}
