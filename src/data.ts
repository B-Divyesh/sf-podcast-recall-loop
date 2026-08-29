import type { AppState, Clip, DailyQueue } from './types';
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
  db.close();
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
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onerror = () => { db.close(); reject(transaction.error); };
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

export type DailyQueueView = {
  queue?: DailyQueue;
  clips: Clip[];
  completed: number;
  changed: boolean;
};

function localDay(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function overdueClips(clips: Clip[], now: Date): Clip[] {
  return clips
    .filter(clip => new Date(clip.dueAt).getTime() <= now.getTime())
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

/**
 * Selects a maximum of three due clips once per local day. The snapshot is
 * retained after answers so an overdue backlog never refills mid-session.
 */
export function dailyQueue(state: AppState, now = new Date()): DailyQueueView {
  const day = localDay(now);
  let changed = false;
  if (!state.dailyQueue || state.dailyQueue.day !== day) {
    const clipIds = overdueClips(state.clips, now).slice(0, 3).map(clip => clip.id);
    state.dailyQueue = clipIds.length ? { day, clipIds, completedIds: [] } : undefined;
    changed = true;
  }

  const queue = state.dailyQueue;
  if (!queue) return { clips: [], completed: 0, changed };

  const validIds = new Set(state.clips.map(clip => clip.id));
  const knownCompleted = queue.completedIds.filter(id => queue.clipIds.includes(id) && validIds.has(id));
  if (knownCompleted.length !== queue.completedIds.length) {
    queue.completedIds = knownCompleted;
    changed = true;
  }
  const completed = new Set(queue.completedIds);
  const clips = queue.clipIds
    .filter(id => !completed.has(id))
    .map(id => state.clips.find(clip => clip.id === id))
    .filter((clip): clip is Clip => Boolean(clip));
  return { queue, clips, completed: queue.completedIds.length, changed };
}

/** Records an answered or removed prompt without allowing the queue to refill. */
export function completeDailyQueueItem(state: AppState, clipId: string): void {
  const queue = state.dailyQueue;
  if (!queue || !queue.clipIds.includes(clipId) || queue.completedIds.includes(clipId)) return;
  queue.completedIds.push(clipId);
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
