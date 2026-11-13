/** User-agent checks shared by the install card and the request shortcut. */

export function isIos(): boolean {
  const ua = navigator.userAgent;
  const iPadOs = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/.test(ua) || iPadOs;
}

export const isIosChrome = (): boolean => isIos() && /CriOS/.test(navigator.userAgent);
