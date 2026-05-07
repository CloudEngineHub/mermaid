import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import db from './xychartDb.js';

describe('xychartDb', () => {
  beforeEach(() => {
    db.clear();
  });

  afterEach(() => {
    db.clear();
  });

  it('preserves sanitized line and bar titles for legends', () => {
    db.setXAxisBand([
      { type: 'text', text: '90d' },
      { type: 'text', text: '60d' },
    ]);

    db.setLineData({ type: 'text', text: ' avg ' }, [48.1, 41.5]);
    db.setBarData({ type: 'text', text: ' p95 ' }, [112.2, 75.3]);

    expect(db.getXYChartData().plots).toEqual([
      expect.objectContaining({
        type: 'line',
        title: 'avg',
      }),
      expect.objectContaining({
        type: 'bar',
        title: 'p95',
      }),
    ]);
  });
});
