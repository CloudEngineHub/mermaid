import { describe, expect, it } from 'vitest';
import { XYChartBuilder } from './index.js';
import type { SVGGroup } from '../../../diagram-api/types.js';
import type { XYChartConfig, XYChartData, XYChartThemeConfig } from './interfaces.js';

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
  title: 'An Example Chart',
  xAxis: {
    type: 'band',
    title: '',
    categories: ['90d', '60d', '30d'],
  },
  yAxis: {
    type: 'linear',
    title: 'Seconds',
    min: 0,
    max: 200,
  },
  plots: [
    {
      type: 'line',
      title: 'avg',
      strokeFill: '#f00',
      strokeWidth: 2,
      data: [
        ['90d', 48.1],
        ['60d', 41.5],
        ['30d', 45.7],
      ],
    },
    {
      type: 'bar',
      title: 'p95',
      fill: '#0f0',
      data: [
        ['90d', 112.2],
        ['60d', 75.3],
        ['30d', 103.0],
      ],
    },
  ],
};

describe('XYChartBuilder', () => {
  it('includes legend drawables when named plots are rendered', () => {
    const drawables = XYChartBuilder.build(
      chartConfig,
      chartData,
      chartThemeConfig,
      undefined as unknown as SVGGroup
    );

    const legendLabels = drawables.find(
      (drawable) => drawable.type === 'text' && drawable.groupTexts.join('.') === 'legend.label'
    );
    const legendLineMarkers = drawables.find(
      (drawable) => drawable.type === 'path' && drawable.groupTexts.join('.') === 'legend.markers'
    );
    const legendBarMarkers = drawables.find(
      (drawable) => drawable.type === 'rect' && drawable.groupTexts.join('.') === 'legend.markers'
    );

    expect(legendLabels?.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: 'avg', fill: '#333' }),
        expect.objectContaining({ text: 'p95', fill: '#333' }),
      ])
    );
    expect(legendLineMarkers?.data).toEqual([
      expect.objectContaining({ strokeFill: '#f00', strokeWidth: 2 }),
    ]);
    expect(legendBarMarkers?.data).toEqual([
      expect.objectContaining({ fill: '#0f0', strokeFill: '#0f0' }),
    ]);
  });

  it('positions horizontal chart legends beside the plot', () => {
    const drawables = XYChartBuilder.build(
      { ...chartConfig, chartOrientation: 'horizontal' },
      chartData,
      chartThemeConfig,
      undefined as unknown as SVGGroup
    );

    const legendLabels = drawables.find(
      (drawable) => drawable.type === 'text' && drawable.groupTexts.join('.') === 'legend.label'
    );

    expect(legendLabels?.data[0]).toEqual(
      expect.objectContaining({
        text: 'avg',
        horizontalPos: 'left',
        verticalPos: 'middle',
      })
    );
  });
});
