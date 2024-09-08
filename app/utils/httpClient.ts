import axios from "axios";
import { Depth, KLine, Ticker, Trade } from "./types";

// const BASE_URL = "https://exchange-proxy.100xdevs.com/api/v1";
const BASE_URL = "http://localhost:3000/api/v1";

export async function getTicker(market: string): Promise<Ticker> {
    console.log(market);
    const tickers = await getTickers();
    const ticker = tickers.find(t => t.symbol === market);
    if (!ticker) {
        throw new Error(`No ticker found for ${market}`);
    }
    return ticker;
}

export async function getTickers(): Promise<Ticker[]> {
    const response = await axios.get(`${BASE_URL}/tickers`);
    console.log(response.data.data.payload.tickers);
    return response.data.data.payload.tickers;
}


export async function getDepth(market: string): Promise<Depth> {
    const response = await axios.get(`${BASE_URL}/depth?symbol=${market}`);
    const data = response.data;

    // Filter out bids and asks with 0 quantity
    const filteredBids = data.bids.filter((bid:any) => Number(bid[1]) > 0);
    const filteredAsks = data.asks.filter((ask:any) => Number(ask[1]) > 0);

    // Return the modified data
    return {
        ...data,
        bids: filteredBids,
        asks: filteredAsks,
    };
}
export async function getTrades(market: string): Promise<Trade[]> {
    const response = await axios.get(`${BASE_URL}/trades?symbol=${market}`);
    return response.data;
}

export async function getKlines(market: string, interval: string, startTime: number, endTime: number): Promise<KLine[]> {
    const response = await axios.get(`${BASE_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
    const data: KLine[] = response.data;
    return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}
