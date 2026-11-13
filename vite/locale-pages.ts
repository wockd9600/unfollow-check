/**
 * Builds one static page per language from the root index.html template.
 *
 * The template holds `{{key}}` slots. Inside an attribute value they get escaped plain text;
 * elsewhere they get the message rendered as HTML, where `<b>` and `<nb>` (no-wrap run) are
 * the only markup allowed. `/en/index.html` and `/ja/index.html` are stubs that this plugin
 * replaces with the filled template, so the same markup serves every language in dev and build.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, SITE_ORIGIN, type Locale } from '../src/i18n/locales';
import * as ko from '../src/i18n/ko';
import * as en from '../src/i18n/en';
import * as ja from '../src/i18n/ja';

const MESSAGES: Readonly<Record<Locale, Readonly<Record<string, string>>>> = {
  ko: { ...ko.page, ...ko.app },
  en: { ...en.page, ...en.app },
  ja: { ...ja.page, ...ja.app },
};

const ATTR_SLOT = /="\{\{([\w.]+)\}\}"/g;
const TEXT_SLOT = /\{\{([\w.]+)\}\}/g;

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Escapes everything, then restores the two inline tags messages may use. */
const renderRich = (text: string): string =>
  escapeHtml(text)
    .replace(/&lt;(\/?)b&gt;/g, '<$1b>')
    .replace(/&lt;nb&gt;/g, '<span class="nb">')
    .replace(/&lt;\/nb&gt;/g, '</span>');

function valuesFor(locale: Locale): Readonly<Record<string, string>> {
  const meta = LOCALE_META[locale];
  return {
    ...MESSAGES[locale],
    lang: locale,
    url: SITE_ORIGIN + meta.path,
    manifest: meta.manifest,
  };
}

function fill(template: string, locale: Locale): string {
  const values = valuesFor(locale);
  const lookup = (key: string): string => {
    const value = values[key];
    if (value === undefined) throw new Error(`[locale-pages] no "${key}" message for ${locale}`);
    return value;
  };
  return template
    .replace(ATTR_SLOT, (_, key: string) => `="${escapeHtml(lookup(key))}"`)
    .replace(TEXT_SLOT, (_, key: string) => renderRich(lookup(key)));
}

/** `/en/index.html` → en; anything else (the root page) → the default locale. */
function localeOfPage(pagePath: string): Locale {
  const match = LOCALES.find((l) => l !== DEFAULT_LOCALE && pagePath === `${LOCALE_META[l].path}index.html`);
  return match ?? DEFAULT_LOCALE;
}

export function localePages(): Plugin {
  let root = process.cwd();
  return {
    name: 'locale-pages',
    configResolved(config) {
      root = config.root;
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const locale = localeOfPage(ctx.path);
        // Stubs are replaced wholesale; reading per request keeps dev in sync with template edits.
        const template = locale === DEFAULT_LOCALE ? html : readFileSync(resolve(root, 'index.html'), 'utf8');
        return fill(template, locale);
      },
    },
  };
}

/** Build inputs: the root page plus one stub per extra language. */
export const localePageInputs: Readonly<Record<string, string>> = Object.fromEntries(
  LOCALES.map((l) => [l, l === DEFAULT_LOCALE ? 'index.html' : `${l}/index.html`]),
);
