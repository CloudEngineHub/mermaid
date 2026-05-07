import { getThemeVariables as getBaseThemeVariables } from './theme-base.js';
import { getThemeVariables as getDarkThemeVariables } from './theme-dark.js';
import { getThemeVariables as getDefaultThemeVariables } from './theme-default.js';
import { getThemeVariables as getForestThemeVariables } from './theme-forest.js';
import { getThemeVariables as getNeoDarkThemeVariables } from './theme-neo-dark.js';
import { getThemeVariables as getNeoThemeVariables } from './theme-neo.js';
import { getThemeVariables as getNeutralThemeVariables } from './theme-neutral.js';
import { getThemeVariables as getReduxColorThemeVariables } from './theme-redux-color.js';
import { getThemeVariables as getReduxDarkColorThemeVariables } from './theme-redux-dark-color.js';
import { getThemeVariables as getReduxDarkThemeVariables } from './theme-redux-dark.js';
import { getThemeVariables as getReduxThemeVariables } from './theme-redux.js';

const themes = [
  ['base', getBaseThemeVariables],
  ['dark', getDarkThemeVariables],
  ['default', getDefaultThemeVariables],
  ['forest', getForestThemeVariables],
  ['neo-dark', getNeoDarkThemeVariables],
  ['neo', getNeoThemeVariables],
  ['neutral', getNeutralThemeVariables],
  ['redux-color', getReduxColorThemeVariables],
  ['redux-dark-color', getReduxDarkColorThemeVariables],
  ['redux-dark', getReduxDarkThemeVariables],
  ['redux', getReduxThemeVariables],
];

describe('xychart theme variables', () => {
  it.each(themes)(
    '%s defaults legend text color to primary text color',
    (_name, getThemeVariables) => {
      const theme = getThemeVariables();

      expect(theme.xyChart.legendTextColor).toBe(theme.primaryTextColor);
    }
  );

  it.each(themes)('%s allows overriding legend text color', (_name, getThemeVariables) => {
    const theme = getThemeVariables({
      xyChart: {
        legendTextColor: '#123456',
      },
    });

    expect(theme.xyChart.legendTextColor).toBe('#123456');
  });
});
