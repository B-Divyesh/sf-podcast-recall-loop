export type RecallResult = 'remembered' | 'sooner';

export interface Clip {
  id: string;
  podcast: string;
  episode: string;
  episodeUrl: string;
  feedUrl: string;
  timestampSec: number;
  prompt: string;
  takeaway: string;
  createdAt: string;
  dueAt: string;
  intervalDays: number;
  reviewCount: number;
  lastResult?: RecallResult;
}

/** A locally dated, fixed set of questions for one day of recall. */
export interface DailyQueue {
  day: string;
  clipIds: string[];
  completedIds: string[];
}

export interface Episode {
  title: string;
  url: string;
  published: string;
}

export interface AppState {
  clips: Clip[];
  dailyQueue?: DailyQueue;
  seeded?: boolean;
}
