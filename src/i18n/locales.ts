/** Supported languages and their per-page settings. Pure data: imported by both the app and the Vite page plugin. */

export const LOCALES = ['ko', 'en', 'ja'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ko';

export const SITE_ORIGIN = 'https://unfollow-check-x.vercel.app';

interface LocaleMeta {
  /** Page path; the root serves the default locale. */
  readonly path: string;
  readonly numberLocale: string;
  readonly manifest: string;
}

export const LOCALE_META: Readonly<Record<Locale, LocaleMeta>> = {
  ko: { path: '/', numberLocale: 'ko-KR', manifest: '/manifest.webmanifest' },
  en: { path: '/en/', numberLocale: 'en-US', manifest: '/manifest.en.webmanifest' },
  ja: { path: '/ja/', numberLocale: 'ja-JP', manifest: '/manifest.ja.webmanifest' },
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
