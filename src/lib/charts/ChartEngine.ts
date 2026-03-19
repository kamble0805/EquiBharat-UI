/**
 * ChartEngine handles initialization and configuration of Lightweight Charts.
 */
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, DeepPartial, ChartOptions, ColorType, CandlestickSeries } from 'lightweight-charts';

export class ChartEngine {
    private chart: IChartApi | null = null;
    private candlestickSeries: ISeriesApi<'Candlestick'> | null = null;

    /**
     * Initialize a new chart in the specified container.
     */
    init(container: HTMLElement, options: DeepPartial<ChartOptions> = {}) {
        const defaultOptions: DeepPartial<ChartOptions> = {
            layout: {
                background: { type: ColorType.Solid, color: '#0f172a' },
                textColor: '#d1d5db',
            },
            grid: {
                vertLines: { color: 'rgba(51, 65, 85, 0.5)' },
                horzLines: { color: 'rgba(51, 65, 85, 0.5)' },
            },
            crosshair: {
                mode: 0, // CrosshairMode.Normal
            },
            rightPriceScale: {
                borderColor: 'rgba(51, 65, 85, 0.8)',
            },
            timeScale: {
                borderColor: 'rgba(51, 65, 85, 0.8)',
                timeVisible: true,
                secondsVisible: false,
            },
            handleScroll: true,
            handleScale: true,
        };

        this.chart = createChart(container, { ...defaultOptions, ...options });

        // Add default candlestick series
        this.candlestickSeries = this.chart.addSeries(CandlestickSeries, {
            upColor: '#10b981',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        });

        return this.chart;
    }

    /**
     * Set historical data for the candlestick series.
     */
    setData(data: CandlestickData<Time>[]) {
        if (this.candlestickSeries) {
            this.candlestickSeries.setData(data);
        }
    }

    /**
     * Update the latest candle or add a new one from a tick.
     */
    update(candle: CandlestickData<Time>) {
        if (this.candlestickSeries) {
            this.candlestickSeries.update(candle);
        }
    }

    /**
     * Handle dynamic resizing of the chart based on container changes.
     */
    resize(width: number, height: number) {
        if (this.chart) {
            this.chart.applyOptions({ width, height });
        }
    }

    /**
     * Remove the chart from the DOM and clean up resources.
     */
    destroy() {
        if (this.chart) {
            this.chart.remove();
            this.chart = null;
            this.candlestickSeries = null;
        }
    }

    /**
     * Get the underlying chart instance for advanced usage.
     */
    getInstance(): IChartApi | null {
        return this.chart;
    }
}
