"use client";
import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "@/app/utils/SignalingManager";
import { Ticker as TickerType} from "../../utils/types";
export function Depth({ market }: {market: string}) {
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [ticker, setTicker] = useState<TickerType | null>(null);
    useEffect(() => {
        getTicker(market).then(setTicker);
        SignalingManager.getInstance().registerCallback("ticker", (data: Partial<TickerType>)  =>  setTicker((prevTicker:any) => ({
            firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? '',
            high: data?.high ?? prevTicker?.high ?? '',
            currentPrice: data?.currentPrice ?? prevTicker?.currentPrice ?? '',
            low: data?.low ?? prevTicker?.low ?? '',
            priceChange: data?.priceChange ?? prevTicker?.priceChange ?? '',
            priceChangePercent: data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? '',
            quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? '',
            symbol: data?.symbol ?? prevTicker?.symbol ?? '',
            trades: data?.trades ?? prevTicker?.trades ?? '',
            volume: data?.volume ?? prevTicker?.volume ?? '',
        })), `TICKER-${market}`);
        SignalingManager.getInstance().registerCallback("depth", (data: any) => {
            // console.log(data);
            setBids((originalBids) => {
                const bidsAfterUpdate = [...(originalBids || [])];
                
                for (let i = 0; i < bidsAfterUpdate.length; i++) {
                    for (let j = 0; j < data.bids.length; j++) {
                        if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
                            bidsAfterUpdate[i][1] = data.bids[j][1];
                            break;
                        }
                    }
                }
            
                let filteredBids = bidsAfterUpdate.filter(bid => Number(bid[1]) > 0);
            
                data.bids.forEach((newBid: any) => {
                    if (!filteredBids.some(bid => bid[0] === newBid[0])) {
                        filteredBids.push(newBid);
                    }
                });
                
                filteredBids = filteredBids.filter(bid => Number(bid[1]) > 0);
                
            
                // filteredBids = filteredBids.filter(bid => data.bids.some((newBid : any)=> newBid[0] === bid[0]));
            
                filteredBids.sort((a, b) => Number(b[0]) - Number(a[0]));
            
                return filteredBids;
            });
            
            
            setAsks((originalAsks) => {
                const asksAfterUpdate = [...(originalAsks || [])];
                console.log(asksAfterUpdate)
                // Update existing asks with new data
                for (let i = 0; i < asksAfterUpdate.length; i++) {
                    for (let j = 0; j < data.asks.length; j++) {
                        if (asksAfterUpdate[i][0] === data.asks[j][0]) {
                            asksAfterUpdate[i][1] = data.asks[j][1];
                            break;
                        }
                    }
                }
            
                // Filter out asks with a quantity of 0 or less
                console .log("Asks After Update" , asksAfterUpdate);
                let filteredAsks = asksAfterUpdate.filter(ask => Number(ask[1]) > 0);
                console.log("Filtered Asks = " , filteredAsks);
                // Add new asks that are not already in filteredAsks
                data.asks.forEach((newAsk: any) => {
                    if (!filteredAsks.some(ask => ask[0] === newAsk[0])) {
                        filteredAsks.push(newAsk);
                    }
                });
                
                filteredAsks = filteredAsks.filter(ask => Number(ask[1]) > 0);

                // Remove asks from filteredAsks that are not in the incoming data
                // filteredAsks = filteredAsks.filter(ask => data.asks.some((newAsk : any)=> newAsk[0] === ask[0]));
            
                // Sort the asks by price (first element)
                filteredAsks.sort((a, b) => Number(a[0]) - Number(b[0]));
            
                return filteredAsks;
            });
            
            
            
        }, `DEPTH-${market}`); 
        SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth@${market}`]});

        getDepth(market).then(d => {    
            setBids(d.bids.reverse());
            setAsks(d.asks);
        });

        return () => {
            SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`depth@${market}`]});
            SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
            SignalingManager.getInstance().deRegisterCallback("ticker", `DEPTH-${market}`);
        }
        
    }, [])
    
    return <div className="h-[100%]">
        <TableHeader />
        {asks && <AskTable asks={asks} />}
        {(ticker?.currentPrice ?? 0) && <div className={`text-[1.2rem] ${
    (ticker?.currentPrice ?? 0) > (ticker?.firstPrice ?? 0) ? 'text-blue-500' : 'text-red-500'
  }`}>{ticker?.currentPrice ?? 0}</div>}
        {bids && <BidTable bids={bids} />}
    </div>
}

function TableHeader() {
    return <div className="flex justify-between text-xs">
        <div className="text-white pl-1 pr-1">Price</div>
        <div className="text-slate-500 pl-1 pr-1">Size</div>
        <div className="text-slate-500 pl-1 pr-1">Total</div>
    </div>
}