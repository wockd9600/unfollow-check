/**
 * 3-step guide (request → wait → upload). Everyone sees the same layout;
 * tapping the request link only marks step 1 and nudges toward coming back.
 */

import { isIosChrome } from './platform';

/**
 * Chrome on iOS does not hand https links to apps, so the X app is opened through its
 * own URL scheme there. Whether the app actually opened cannot be detected reliably
 * (a timed redirect fired even after a successful launch), so a web link is revealed instead.
 */
const APP_SCHEME_URL = 'twitter://settings/account';

function openInApp(fallback: HTMLElement | null): void {
  if (fallback) fallback.hidden = false;
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

  if (isIosChrome()) {
    const fallback = document.getElementById('request-fallback');
    requestLink.addEventListener('click', (e) => {
      e.preventDefault();
      openInApp(fallback);
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
