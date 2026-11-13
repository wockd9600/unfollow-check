/**
 * 3-step guide (request → wait → upload). Everyone sees the same layout;
 * tapping the request link only marks step 1 and nudges toward coming back.
 */

import { isIosChrome } from './platform';

/**
 * Chrome on iOS does not hand https links to apps, so the X app is opened through its
 * own URL scheme there. Nothing happens when the app is missing, hence the timed web fallback.
 */
const APP_SCHEME_URL = 'twitter://settings/account';
const APP_FALLBACK_DELAY_MS = 1500;

function openInApp(webUrl: string): void {
  let hasLeftPage = false;
  const onVisibility = () => {
    if (document.hidden) hasLeftPage = true;
  };
  document.addEventListener('visibilitychange', onVisibility);
  window.setTimeout(() => {
    document.removeEventListener('visibilitychange', onVisibility);
    // Still here and never backgrounded: the app did not open, so use the web instead.
    if (!hasLeftPage) window.location.assign(webUrl);
  }, APP_FALLBACK_DELAY_MS);

  try {
    window.location.href = APP_SCHEME_URL;
  } catch (err) {
    console.error('[unfollow-check] X app scheme failed', err);
  }
}

const INSTALL_NUDGE = '파일 알림이 오면 바로 열 수 있게 추가해 두세요.';

export function setupOnboarding(): void {
  const stepRequest = document.getElementById('step-request');
  const requestLink = document.getElementById('request-link');
  const requestNote = document.getElementById('request-note');
  if (!stepRequest || !requestLink || !requestNote) {
    console.error('[unfollow-check] onboarding markup missing');
    return;
  }

  if (isIosChrome() && requestLink instanceof HTMLAnchorElement) {
    requestLink.addEventListener('click', (e) => {
      e.preventDefault();
      openInApp(requestLink.href);
    });
  }

  requestLink.addEventListener('click', () => {
    const install = document.getElementById('install');
    const installSub = document.getElementById('install-sub');
    const canInstall = install?.hidden === false;

    stepRequest.classList.add('done');
    requestNote.textContent = `요청했다면 이제 기다리기만 하면 돼요. ${canInstall ? '홈 화면에 추가해' : '이 페이지를 즐겨찾기해'} 두면 다시 찾기 쉬워요.`;
    requestNote.hidden = false;
    if (installSub) installSub.textContent = INSTALL_NUDGE;
  });
}
