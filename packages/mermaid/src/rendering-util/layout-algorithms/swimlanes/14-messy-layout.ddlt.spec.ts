import { describe, expect, it } from 'vitest';
import { loadDdltFixture } from '../ddlt/loadDdltFixture.js';
import { validateLayout } from '../layout-utils/validateLayout.js';

describe('Swimlanes DDLT - 14-messy-layout.mmd', () => {
  it('Level 2: validateLayout - routes the messy purchase flow as a valid layout', async () => {
    const layout = await loadDdltFixture('swimlanes/14-messy-layout', {
      backendId: 'swimlanes',
    });
    const result = validateLayout(layout);

    if (!result.ok) {
      console.log('[14_MESSY_LAYOUT_DDLT] validateLayout result:', JSON.stringify(result, null, 2));
    }

    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });
});
