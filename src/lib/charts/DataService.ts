/**
 * DataService handles fetching historical data and real-time WebSocket streams.
 */
export class DataService {
    private socket: WebSocket | null = null;
    private onTickCallback: ((tick: any) => void) | null = null;

    /**
     * Fetch historical OHLC data for a symbol.
     */
    async fetchHistoricalData(symbol: string, interval: string = '1m') {
        try {
            const response = await fetch(`/api/market-data?symbol=${symbol}&interval=${interval}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch historical data: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Market data fetch failed:', error);
            // Return empty or throw, but don't mock it on the client
            return [];
        }
    }

    /**
     * Connect to the market data WebSocket stream.
     */
    connectWebSocket(onTick: (tick: any) => void) {
        this.onTickCallback = onTick;

        // Use the backend host or environment variable
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://your-domain.com/ws/market-stream';

        try {
            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = () => {
                console.log('Market data WebSocket connected');
            };

            this.socket.onmessage = (event) => {
                if (this.onTickCallback) {
                    try {
                        const data = JSON.parse(event.data);
                        this.onTickCallback(data);
                    } catch (e) {
                        console.error('Error parsing WebSocket message:', e);
                    }
                }
            };

            this.socket.onerror = (error) => {
                console.error('Market WebSocket connection failed.', error);
            };

            this.socket.onclose = () => {
                console.log('WebSocket disconnected');
            };
        } catch (error) {
            console.error('Failed to create WebSocket', error);
        }
    }

    private lastMockPrice: number = 22000;


    /**
     * Subscribe to a specific symbol for real-time updates.
     */
    subscribe(symbol: string) {
        // For mock simulation, update the base price based on symbol
        if (symbol.includes('BANK')) this.lastMockPrice = 51234;
        else this.lastMockPrice = 24156;

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ action: 'subscribe', symbol }));
        }
    }

    /**
     * Unsubscribe from a symbol.
     */
    unsubscribe(symbol: string) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ action: 'unsubscribe', symbol }));
        }
    }

    /**
     * Cleanup WebSocket connection.
     */
    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}
