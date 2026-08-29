import { describe, expect, test } from 'vitest';
import { completeDailyQueueItem, dailyQueue, formatTimestamp, parseTimestamp, toCsv, toMarkdown } from '../../src/data';
import { sampleClips } from '../../src/sample';

describe('recall data helpers', () => {
  test('parses and formats valid timestamps', () => {
    expect(parseTimestamp('12:34')).toBe(754);
    expect(parseTimestamp('1:02:03')).toBe(3723);
    expect(formatTimestamp(3723)).toBe('1:02:03');
  });

  test('rejects invalid timestamps', () => {
    expect(parseTimestamp('12:99')).toBeNull();
    expect(parseTimestamp('not a time')).toBeNull();
  });

  test('exports every sample clip without losing quoted text', () => {
    const csv = toCsv(sampleClips);
    expect(csv.trim().split('\n')).toHaveLength(sampleClips.length + 1);
    expect(csv).toContain('"Why retrieval beats rereading"');
    const markdown = toMarkdown(sampleClips);
    expect(markdown.match(/^## /gm)).toHaveLength(sampleClips.length);
  });

  test('keeps a three-item daily snapshot until the local day changes', () => {
    const state = { clips: structuredClone(sampleClips) };
    state.clips.forEach(clip => { clip.dueAt = '2020-01-01T08:00:00.000Z'; });
    const first = dailyQueue(state, new Date('2026-08-29T12:00:00'));
    expect(first.clips).toHaveLength(3);
    expect(first.queue?.clipIds).toHaveLength(3);
    completeDailyQueueItem(state, first.clips[0]!.id);
    completeDailyQueueItem(state, first.clips[1]!.id);
    completeDailyQueueItem(state, first.clips[2]!.id);
    state.clips
      .filter(clip => first.queue?.clipIds.includes(clip.id))
      .forEach(clip => { clip.dueAt = '2099-01-01T08:00:00.000Z'; });
    expect(dailyQueue(state, new Date('2026-08-29T18:00:00')).clips).toHaveLength(0);
    expect(dailyQueue(state, new Date('2026-08-30T08:00:00')).clips).toHaveLength(2);
  });

  test('counts a deleted queued question as completed for the day', () => {
    const state = { clips: structuredClone(sampleClips) };
    state.clips.forEach(clip => { clip.dueAt = '2020-01-01T08:00:00.000Z'; });
    const queue = dailyQueue(state, new Date('2026-08-29T12:00:00'));
    const removedId = queue.clips[0]!.id;
    completeDailyQueueItem(state, removedId);
    state.clips = state.clips.filter(clip => clip.id !== removedId);
    const afterDelete = dailyQueue(state, new Date('2026-08-29T12:01:00'));
    expect(afterDelete.completed).toBe(1);
    expect(afterDelete.clips).toHaveLength(2);
  });
});
