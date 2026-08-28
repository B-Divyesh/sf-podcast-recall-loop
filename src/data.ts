import type { AppState, Clip } from './types';
import { sampleState } from './sample';

const DB_VERSION = 1;
const STORE = 'workspace';

function openDb(demo: boolean): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(demo ? 'podcast-recall-loop-demo' : 'podcast-recall-loop', DB_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readState(db: IDBDatabase): Promise<AppState | undefined> {
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE).objectStore(STORE).get('state');
    request.onsuccess = () => resolve(request.result as AppState | undefined);
    request.onerror = () => reject(request.error);
  });
}

export async function loadState(demo: boolean): Promise<AppState> {
  const db = await openDb(demo);
  const existing = await readState(db);
  if (existing) return existing;
  const initial = demo ? sampleState() : { clips: [] };
  await saveState(demo, initial);
  return initial;
}

export async function saveState(demo: boolean, state: AppState): Promise<void> {
  const db = await openDb(demo);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite');
    transaction.objectStore(STORE).put(state, 'state');
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function resetDemo(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('podcast-recall-loop-demo');
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}

export function dueClips(clips: Clip[]): Clip[] {
  const now = Date.now();
  return clips.filter(clip => new Date(clip.dueAt).getTime() <= now).sort((a, b) => a.dueAt.localeCompare(b.dueAt)).slice(0, 3);
}

export function scheduleClip(clip: Clip, result: 'remembered' | 'sooner'): Clip {
  const intervalDays = result === 'remembered' ? Math.min(Math.max(clip.intervalDays * 2, 2), 30) : 1;
  const due = new Date();
  due.setDate(due.getDate() + intervalDays);
  due.setHours(5, 0, 0, 0);
  return { ...clip, intervalDays, dueAt: due.toISOString(), reviewCount: clip.reviewCount + 1, lastResult: result };
}

export function formatTimestamp(total: number): string {
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function parseTimestamp(value: string): number | null {
  const parts = value.trim().split(':').map(Number);
  if (!parts.length || parts.some(part => !Number.isFinite(part) || part < 0)) return null;
  if (parts.length === 2 && parts[1]! < 60) return parts[0]! * 60 + parts[1]!;
  if (parts.length === 3 && parts[1]! < 60 && parts[2]! < 60) return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!;
  return null;
}

function csvCell(value: string | number): string {
  const safe = String(value).replaceAll('"', '""');
  return `"${safe}"`;
}

export function toCsv(clips: Clip[]): string {
  const headers = ['podcast', 'episode', 'timestamp', 'prompt', 'takeaway', 'due_date', 'reviews'];
  const rows = clips.map(clip => [clip.podcast, clip.episode, formatTimestamp(clip.timestampSec), clip.prompt, clip.takeaway, clip.dueAt, clip.reviewCount].map(csvCell).join(','));
  return [headers.join(','), ...rows].join('\n');
}

export function toMarkdown(clips: Clip[]): string {
  return ['# Podcast recall clips', '', ...clips.flatMap(clip => [
    `## ${clip.prompt}`,
    '',
    `- Podcast: ${clip.podcast}`,
    `- Episode: ${clip.episode}`,
    `- Timestamp: ${formatTimestamp(clip.timestampSec)}`,
    `- Takeaway: ${clip.takeaway}`,
    ''
  ])].join('\n');
}
