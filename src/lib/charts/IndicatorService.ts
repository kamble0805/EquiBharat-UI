/**
 * IndicatorService provides methods to add technical indicators to the chart.
 * Currently a placeholder for future extensions (MAS, Volume, etc.)
 */
import { IChartApi, ISeriesApi, LineData, Time, LineSeries, HistogramSeries } from 'lightweight-charts';

export class IndicatorService {
    /**
     * Add a simple moving average (SMA) to the chart.
     */
    addSMA(chart: any, data: LineData<Time>[], options = {}) {
        const smaSeries = chart.addSeries(LineSeries, {
            color: '#3b82f6',
            lineWidth: 2,
            ...options,
        });
        smaSeries.setData(data);
        return smaSeries;
    }

    /**
     * Add a volume histogram to the chart.
     */
    addVolume(chart: any, data: any[], options = {}) {
        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#334155',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '', // Overlay on main pane, but in background
            ...options,
        });
        volumeSeries.setData(data);
        return volumeSeries;
    }
}
