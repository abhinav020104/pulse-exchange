
export const AskTable = ({ asks }: { asks: [string, string][] }) => {
    let currentTotal = 0;
    const relevantAsks = asks.slice(0, 10);
    relevantAsks.reverse();
    let asksWithTotal:[string , string , number][] = [];
    for(let i =  relevantAsks.length-1 ; i >= 0 ; i--){
        const [price , quantity] = relevantAsks[i];
        asksWithTotal.push([price , quantity  , currentTotal+= Number(quantity)]);
    }
    asksWithTotal.reverse();
    const maxTotal = relevantAsks.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);
    return <div>
        {asksWithTotal.map(([price, quantity, total]) => <Ask maxTotal={maxTotal} key={price} price={price} quantity={quantity} total={total} />)}
    </div>
}
function Ask({price, quantity, total, maxTotal}: {price: string, quantity: string, total: number, maxTotal: number}) {
    return <div
        style={{
        display: "flex",
        position: "relative",
        width: "100%",
        backgroundColor: "transparent",
        overflow: "hidden", }}
        >
        <div
        style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: `${(100 * total) / maxTotal}%`,
        height: "100%",
        background: "rgb(225, 50, 85,0.325)",
        transition: "width 0.3s ease-in-out",}}
        ></div>
        <div className="flex justify-between text-[.9rem] w-full pl-1 pr-1 h-[27px] overflow-y-auto">
            <div>
                {price}
            </div>
            <div>
                {quantity}
            </div>
            <div>
                {total?.toFixed(2)}
            </div>
        </div>
    </div>
}