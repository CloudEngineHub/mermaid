import { describe, expect, it } from 'vitest';
import { ChartLegend } from './legend.js';
import type { XYChartConfig, XYChartData, XYChartThemeConfig } from '../interfaces.js';
import type { TextDimensionCalculator } from '../textDimensionCalculator.js';

const textDimensionCalculator: TextDimensionCalculator = {
  getMaxDimension: (texts, fontSize) => ({
    width: Math.max(...texts.map((text) => text.length)) * fontSize,
    height: fontSize,
  }),
};

const chartConfig: XYChartConfig = {
  width: 700,
  height: 500,
  titleFontSize: 20,
  titlePadding: 10,
  showTitle: true,
  showLegend: true,
  legendFontSize: 14,
  legendPadding: 10,
  showDataLabel: false,
  showDataLabelOutsideBar: false,
  chartOrientation: 'vertical',
  plotReservedSpacePercent: 50,
  xAxis: {
    showLabel: true,
    labelFontSize: 14,
    labelPadding: 5,
    showTitle: true,
    titleFontSize: 16,
    titlePadding: 5,
    showTick: true,
    tickLength: 5,
    tickWidth: 2,
    showAxisLine: true,
    axisLineWidth: 2,
  },
  yAxis: {
    showLabel: true,
    labelFontSize: 14,
    labelPadding: 5,
    showTitle: true,
    titleFontSize: 16,
    titlePadding: 5,
    showTick: true,
    tickLength: 5,
    tickWidth: 2,
    showAxisLine: true,
    axisLineWidth: 2,
  },
};

const chartThemeConfig: XYChartThemeConfig = {
  backgroundColor: '#fff',
  titleColor: '#111',
  dataLabelColor: '#222',
  legendTextColor: '#333',
  xAxisLabelColor: '#444',
  xAxisTitleColor: '#555',
  xAxisTickColor: '#666',
  xAxisLineColor: '#777',
  yAxisLabelColor: '#888',
  yAxisTitleColor: '#999',
  yAxisTickColor: '#aaa',
  yAxisLineColor: '#bbb',
  plotColorPalette: '#f00,#0f0',
};

const chartData: XYChartData = {
  title: 'Latency',
  xAxis: {
    type: 'band',
    title: '',
    categories: ['90d', '60d'],
  },
  yAxis: {
    type: 'linear',
    title: 'Seconds',
    min: 0,
    max: 100,
  },
  plots: [
    {
      type: 'line',
      title: 'avg',
      strokeFill: '#f00',
      strokeWidth: 2,
      data: [
        ['90d', 40],
        ['60d', 50],
      ],
    },
    {
      type: 'bar',
      title: 'p95',
      fill: '#0f0',
      data: [
        ['90d', 80],
        ['60d', 90],
      ],
    },
    {
      type: 'line',
      title: '',
      strokeFill: '#00f',
      strokeWidth: 2,
      data: [
        ['90d', 30],
        ['60d', 35],
      ],
    },
  ],
};

describe('ChartLegend', () => {
  it('renders marker and label drawables for named line and bar plots', () => {
    const legend = new ChartLegend(
      textDimensionCalculator,
      chartConfig,
      chartData,
      chartThemeConfig
    );

    expect(legend.calculateSpace({ width: 200, height: 200 })).toEqual({
      width: 77.4,
      height: 55,
    });

    legend.setBoundingBoxXY({ x: 100, y: 50 });
    const drawables = legend.getDrawableElements();

    expect(drawables).toHaveLength(3);
    expect(drawables[0]).toMatchObject({
      groupTexts: ['legend', 'markers'],
      type: 'rect',
      data: [
        {
          x: 110,
          y: 81,
          width: 10.5,
          height: 10.5,
          fill: '#0f0',
          strokeFill: '#0f0',
          strokeWidth: 0,
        },
      ],
    });
    expect(drawables[1]).toMatchObject({
      groupTexts: ['legend', 'markers'],
      type: 'path',
      data: [
        {
          path: 'M 110,65.25 L 120.5,65.25',
          strokeFill: '#f00',
          strokeWidth: 2,
        },
      ],
    });
    expect(drawables[2]).toMatchObject({
      groupTexts: ['legend', 'label'],
      type: 'text',
      data: [
        {
          text: 'avg',
          x: 125.4,
          y: 65.25,
          fill: '#333',
          fontSize: 14,
          rotation: 0,
          verticalPos: 'middle',
          horizontalPos: 'left',
        },
        {
          text: 'p95',
          x: 125.4,
          y: 86.25,
          fill: '#333',
          fontSize: 14,
          rotation: 0,
          verticalPos: 'middle',
          horizontalPos: 'left',
        },
      ],
    });
  });

  it('does not render when legends are disabled or no named plots fit', () => {
    const disabledLegend = new ChartLegend(
      textDimensionCalculator,
      { ...chartConfig, showLegend: false },
      chartData,
      chartThemeConfig
    );
    expect(disabledLegend.calculateSpace({ width: 200, height: 200 })).toEqual({
      width: 0,
      height: 0,
    });
    expect(disabledLegend.getDrawableElements()).toEqual([]);

    const crampedLegend = new ChartLegend(
      textDimensionCalculator,
      chartConfig,
      chartData,
      chartThemeConfig
    );
    expect(crampedLegend.calculateSpace({ width: 20, height: 20 })).toEqual({
      width: 0,
      height: 0,
    });
    expect(crampedLegend.getDrawableElements()).toEqual([]);
  });
});
