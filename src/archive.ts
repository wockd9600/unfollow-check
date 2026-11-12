import { BlobReader, TextWriter, ZipReader, configure, type FileEntry } from '@zip.js/zip.js';

// Only two small text files are inflated, so a worker is not worth the CSP/bundling cost.
configure({ useWebWorkers: false });

export type Kind = 'followers' | 'following';

export interface Archive {
  readonly followers: readonly string[];
  readonly following: readonly string[];
}

export class ArchiveError extends Error {}

const ENTRY_PATTERN = /(^|\/)(follower|following)(-part\d+)?\.js$/i;
const ACCOUNT_ID_PATTERN = /^\d{1,25}$/;

/** Parses `window.YTD.follower.part0 = [...]` into its JSON array. */
export function parseYtd(text: string): unknown[] {
  const eq = text.indexOf('=');
  if (eq < 0) throw new ArchiveError('파일 형식을 읽지 못했어요. X 아카이브의 원본 .js 파일인지 확인해 주세요.');
  try {
    const parsed: unknown = JSON.parse(text.slice(eq + 1).trim().replace(/;\s*$/, ''));
    if (!Array.isArray(parsed)) throw new Error('not an array');
    return parsed;
  } catch {
    throw new ArchiveError('파일 내용이 손상됐거나 X 아카이브 형식이 아니에요.');
  }
}

export function kindOf(text: string): Kind | null {
  if (/window\.YTD\.following\.part/.test(text)) return 'following';
  if (/window\.YTD\.follower\.part/.test(text)) return 'followers';
  return null;
}

function accountIdOf(item: unknown): string | null {
  if (typeof item !== 'object' || item === null) return null;
  const record = item as Record<string, unknown>;
  const inner = (record.follower ?? record.following) as Record<string, unknown> | undefined;
  const id = inner?.accountId;
  const value = typeof id === 'string' || typeof id === 'number' ? String(id) : '';
  return ACCOUNT_ID_PATTERN.test(value) ? value : null;
}

export function idsFrom(items: readonly unknown[]): string[] {
  return items.map(accountIdOf).filter((id): id is string => id !== null);
}

async function textsFromZip(file: File): Promise<string[]> {
  // BlobReader reads by slicing, so only the central directory and the two
  // entries we need are loaded — multi-GB archives stay cheap on phones.
  const reader = new ZipReader(new BlobReader(file));
  try {
    const entries = await reader.getEntries();
    const wanted = entries.filter((e): e is FileEntry => !e.directory && ENTRY_PATTERN.test(e.filename));
    return await Promise.all(wanted.map((e) => e.getData(new TextWriter())));
  } catch (e) {
    if (e instanceof ArchiveError) throw e;
    throw new ArchiveError('zip 파일을 열지 못했어요. 다운로드가 끝까지 됐는지 확인해 주세요.');
  } finally {
    await reader.close();
  }
}

const isZip = (file: File) => /\.zip$/i.test(file.name) || file.type === 'application/zip';

export async function readArchive(files: readonly File[]): Promise<Archive> {
  const texts: string[] = [];
  for (const file of files) {
    if (isZip(file)) texts.push(...(await textsFromZip(file)));
    else texts.push(await file.text());
  }

  const found: Record<Kind, string[] | null> = { followers: null, following: null };
  for (const text of texts) {
    const kind = kindOf(text);
    if (!kind) continue;
    found[kind] = [...(found[kind] ?? []), ...idsFrom(parseYtd(text))];
  }

  if (!found.followers && !found.following) {
    throw new ArchiveError('follower.js와 following.js를 찾지 못했어요. 아카이브 zip을 그대로 넣거나 data 폴더의 두 파일을 넣어 주세요.');
  }
  if (!found.followers) throw new ArchiveError('follower.js가 없어요. following.js와 함께 넣어 주세요.');
  if (!found.following) throw new ArchiveError('following.js가 없어요. follower.js와 함께 넣어 주세요.');

  return { followers: [...new Set(found.followers)], following: [...new Set(found.following)] };
}
