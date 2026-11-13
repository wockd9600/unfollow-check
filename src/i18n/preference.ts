/**
 * Which language page to show. The root (/) is Korean; first-time visitors whose device
 * prefers Japanese or another language are sent to /ja/ or /en/. A language picked in the
 * switcher, or a language page opened directly, is remembered for later visits.
 */

import { DEFAULT_LOCALE, LOCALES, LOCALE_META, isLocale, type Locale } from './locales';
import { locale } from './index';

const STORE_KEY = 'unfollow-check:locale';
/** Devices in languages we don't support get the English page. */
const FALLBACK_FOREIGN_LOCALE: Locale = 'en';

function loadStored(): Locale | null {
  try {
    const value = localStorage.getItem(STORE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null; // storage unavailable (private mode): fall back to device language
  }
}

function store(value: Locale): void {
  try {
    localStorage.setItem(STORE_KEY, value);
  } catch {
    /* not persisted; detection runs again next visit */
  }
}

function detectFromDevice(): Locale {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const primary = tag.toLowerCase().split('-')[0];
    if (isLocale(primary)) return primary;
  }
  return FALLBACK_FOREIGN_LOCALE;
}

/** Returns true when the page is navigating away, so the caller can skip setting up this one. */
export function redirectToPreferredLocale(): boolean {
  if (locale !== DEFAULT_LOCALE) {
    store(locale);
    return false;
  }
  if (location.pathname !== LOCALE_META[DEFAULT_LOCALE].path) return false;

  const preferred = loadStored() ?? detectFromDevice();
  if (preferred === DEFAULT_LOCALE) return false;
  location.replace(LOCALE_META[preferred].path + location.search + location.hash);
  return true;
}

/** Marks the current language in the switcher and remembers whichever one is picked. */
export function setupLanguageSwitcher(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>('a[data-locale]');
  links.forEach((link) => {
    const target = link.dataset.locale;
    if (!isLocale(target)) return;
    if (target === locale) link.setAttribute('aria-current', 'page');
    link.addEventListener('click', () => store(target));
  });
  if (links.length !== LOCALES.length) console.error('[unfollow-check] language switcher markup incomplete');
}
