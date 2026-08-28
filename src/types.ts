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

export interface Episode {
  title: string;
  url: string;
  published: string;
}

export interface AppState {
  clips: Clip[];
  seeded?: boolean;
}
