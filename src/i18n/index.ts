/** Runtime text for the current page. The page language is fixed per URL and stamped on <html lang> by the page plugin. */

import { DEFAULT_LOCALE, LOCALE_META, isLocale, type Locale } from './locales';
import { app as ko, type AppKey, type AppMessages } from './ko';
import { app as en } from './en';
import { app as ja } from './ja';

const MESSAGES: Readonly<Record<Locale, AppMessages>> = { ko, en, ja };

const pageLang = document.documentElement.lang;

export const locale: Locale = isLocale(pageLang) ? pageLang : DEFAULT_LOCALE;

type Vars = Readonly<Record<string, string | number>>;

/** Looks up a runtime string and fills `{name}` slots; unknown slots (like `{share}`) are left as is. */
export function t(key: AppKey, vars?: Vars): string {
  const text = MESSAGES[locale][key];
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (slot, name: string) => (name in vars ? String(vars[name]) : slot));
}

const numberFormat = new Intl.NumberFormat(LOCALE_META[locale].numberLocale);

export const fmt = (n: number): string => numberFormat.format(n);
