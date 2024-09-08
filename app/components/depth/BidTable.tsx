
export const BidTable = ({ bids }: {bids: [string, string][]}) => {
    let currentTotal = 0; 
    const relevantBids = bids.slice(0, 10);
    relevantBids.reverse();
    let bidsWithTotal:[string , string , number][] = [];
    for(let i =  relevantBids.length-1 ; i >= 0 ; i--){
        const [price , quantity] = relevantBids[i];
        bidsWithTotal.push([price , quantity  , currentTotal+= Number(quantity)]);
    }
    const maxTotal = relevantBids.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);
    return <div>
        {bidsWithTotal?.map(([price, quantity, total]) => <Bid maxTotal={maxTotal} total={total} key={price} price={price} quantity={quantity} />)}
    </div>
}

function Bid({ price, quantity, total, maxTotal }: { price: string, quantity: string, total: number, maxTotal: number }) {
    return (
        <div
            style={{
                display: "flex",
                position: "relative",
                width: "100%",
                backgroundColor: "transparent",
                overflow: "hidden",
            }}
        >
        <div
            style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${(100 * total) / maxTotal}%`,
            height: "100%",
            background: "rgb(54, 116, 217,0.325)",
            transition: "width 0.3s ease-in-out",   
            }}
        ></div>
            <div className={`flex justify-between text-[.9rem] w-full pl-1 pr-1 h-[27px]`}>
                <div>
                    {price}
                </div>
                <div>
                    {quantity}
                </div>
                <div>
                    {total.toFixed(2)}
                </div>
            </div>
        </div>
    );
}
