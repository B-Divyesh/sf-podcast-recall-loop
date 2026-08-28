import type { AppState, Clip } from './types';

const TODAY = '2020-01-01T08:00:00.000Z';

export const sampleClips: Clip[] = [
  {
    id: 'sample-1', podcast: 'The Learning Workshop', episode: 'Why retrieval beats rereading',
    episodeUrl: '', feedUrl: '', timestampSec: 754,
    prompt: 'Why does retrieving an idea strengthen memory more than rereading it?',
    takeaway: 'Retrieval rebuilds the path to an idea. Rereading only makes the page feel familiar.',
    createdAt: TODAY, dueAt: TODAY, intervalDays: 1, reviewCount: 0
  },
  {
    id: 'sample-2', podcast: 'Small Systems', episode: 'Make habits survive busy weeks',
    episodeUrl: '', feedUrl: '', timestampSec: 1118,
    prompt: 'What is the “floor” version of a habit?',
    takeaway: 'It is the smallest useful version you can still do on a difficult day.',
    createdAt: TODAY, dueAt: TODAY, intervalDays: 2, reviewCount: 1, lastResult: 'remembered'
  },
  {
    id: 'sample-3', podcast: 'Civic Signals', episode: 'How public spaces teach trust',
    episodeUrl: '', feedUrl: '', timestampSec: 2045,
    prompt: 'How can a well-kept public space create trust?',
    takeaway: 'Visible shared care gives people evidence that cooperation is normal here.',
    createdAt: TODAY, dueAt: TODAY, intervalDays: 1, reviewCount: 0
  },
  {
    id: 'sample-4', podcast: 'The Learning Workshop', episode: 'Good explanations use boundaries',
    episodeUrl: '', feedUrl: '', timestampSec: 488,
    prompt: 'What makes a boundary example useful in an explanation?',
    takeaway: 'It shows the exact point where a rule stops working.',
    createdAt: TODAY, dueAt: '2099-02-02T08:00:00.000Z', intervalDays: 4, reviewCount: 2
  },
  {
    id: 'sample-5', podcast: 'Field Notes on Work', episode: 'Decisions need a stopping rule',
    episodeUrl: '', feedUrl: '', timestampSec: 927,
    prompt: 'Why set a stopping rule before gathering more information?',
    takeaway: 'A stopping rule prevents research from becoming a way to avoid deciding.',
    createdAt: TODAY, dueAt: '2099-02-04T08:00:00.000Z', intervalDays: 3, reviewCount: 2
  }
];

export const sampleState = (): AppState => ({ clips: structuredClone(sampleClips), seeded: true });
