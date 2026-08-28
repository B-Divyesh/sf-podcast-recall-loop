import { describe, expect, test } from 'vitest';
import { formatTimestamp, parseTimestamp, toCsv, toMarkdown } from '../../src/data';
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
});
