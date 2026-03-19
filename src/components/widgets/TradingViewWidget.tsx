'use client';

import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(
        () => {
            if (!container.current) return;

            // Check if script already exists to avoid duplicates
            if (container.current.querySelector('script')) return;

            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = JSON.stringify({
                "lineWidth": 2,
                "lineType": 0,
                "chartType": "area",
                "fontColor": "rgb(106, 109, 120)",
                "gridLineColor": "rgba(242, 242, 242, 0.06)",
                "volumeUpColor": "rgba(34, 171, 148, 0.5)",
                "volumeDownColor": "rgba(247, 82, 95, 0.5)",
                "backgroundColor": "#0F0F0F",
                "widgetFontColor": "#DBDBDB",
                "upColor": "#22ab94",
                "downColor": "#f7525f",
                "borderUpColor": "#22ab94",
                "borderDownColor": "#f7525f",
                "wickUpColor": "#22ab94",
                "wickDownColor": "#f7525f",
                "colorTheme": "dark",
                "isTransparent": false,
                "locale": "en",
                "chartOnly": false,
                "scalePosition": "right",
                "scaleMode": "Normal",
                "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
                "valuesTracking": "1",
                "changeMode": "price-and-percent",
                "symbols": [
                    [
                        "NSE:NIFTY|1D"
                    ]
                ],
                "dateRanges": [
                    "1d|1",
                    "1m|30",
                    "3m|60",
                    "12m|1D",
                    "60m|1W",
                    "all|1M"
                ],
                "fontSize": "10",
                "headerFontSize": "medium",
                "autosize": true,
                "width": "100%",
                "height": "100%",
                "noTimeScale": false,
                "hideDateRanges": false,
                "hideMarketStatus": false,
                "hideSymbolLogo": false
            });

            container.current.appendChild(script);

            return () => {
                if (container.current) {
                    container.current.innerHTML = '';
                }
            };
        },
        []
    );

    return (
        <div className="tradingview-widget-container h-full w-full flex flex-col" ref={container}>
            <div className="tradingview-widget-container__widget flex-grow w-full"></div>
            <div className="tradingview-widget-copyright text-xs text-muted-foreground pt-1 pb-1">
                <a href="https://www.tradingview.com/symbols/NSE-NIFTY/" rel="noopener nofollow" target="_blank" className="text-primary hover:underline font-medium">
                    <span className="blue-text">NIFTY quote</span>
                </a>
                <span className="trademark"> by TradingView</span>
            </div>
        </div>
    );
}

export default memo(TradingViewWidget);
