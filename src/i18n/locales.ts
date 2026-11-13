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
  /** Open Graph locale, e.g. ko_KR. */
  readonly ogLocale: string;
  /** Link-preview image (1200×630) in public/. */
  readonly ogImage: string;
}

export const LOCALE_META: Readonly<Record<Locale, LocaleMeta>> = {
  ko: { path: '/', numberLocale: 'ko-KR', manifest: '/manifest.webmanifest', ogLocale: 'ko_KR', ogImage: '/og-ko.png' },
  en: { path: '/en/', numberLocale: 'en-US', manifest: '/manifest.en.webmanifest', ogLocale: 'en_US', ogImage: '/og-en.png' },
  ja: { path: '/ja/', numberLocale: 'ja-JP', manifest: '/manifest.ja.webmanifest', ogLocale: 'ja_JP', ogImage: '/og-ja.png' },
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
