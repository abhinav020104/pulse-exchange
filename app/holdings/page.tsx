"use client";
import { useEffect, useState } from "react";
import { SignalingManager } from "../utils/SignalingManager";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/store/User";
import toast from "react-hot-toast";
import axios from "axios";
import { SwapUI } from "../components/SwapUI"; // Import the SwapUI component

const Holdings = () => {
    const [holdings, setHoldings] = useState([]);
    const [tickers, setTickers] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
    const user = useRecoilValue(userAtom);

    // Fetch holdings on component mount
    const fetchHoldings = async () => {
        try {
            toast.loading("Fetching User Holdings!");
            const response = await axios.post("http://localhost:3000/api/v1/order/getholdings", {
                userId: user.UserId,
            });
            toast.dismiss();
            toast.success("Holdings Fetched Successfully!");
            setHoldings(response.data.data);

            // Subscribe to ticker for each holding after fetching holdings
            response.data.data.forEach((holding: any) => {
                subscribeToTicker(holding.asset);
            });
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to fetch User Holdings!");
            console.error("Frontend Holding fetching error:", error);
        }
    };

    useEffect(() => {
        if (user?.UserId) {
            fetchHoldings();
        }
    }, [user]);

    // Subscribe to the ticker of each asset
    const subscribeToTicker = (asset: any) => {
        SignalingManager.getInstance().sendMessage({
            method: "SUBSCRIBE",
            params: [`ticker@${asset}`],
        });
        SignalingManager.getInstance().registerCallback(
            "ticker",
            (data: any) => {
                setTickers((prevTickers) => ({
                    ...prevTickers,
                    [asset]: {
                        //@ts-ignore
                        firstPrice: data?.firstPrice ?? prevTickers?.[asset]?.firstPrice ?? '',
                        //@ts-ignore
                        high: data?.high ?? prevTickers?.[asset]?.high ?? '',
                        //@ts-ignore
                        c: data?.c ?? prevTickers?.[asset]?.c ?? '',
                        //@ts-ignore
                        low: data?.low ?? prevTickers?.[asset]?.low ?? '',
                        //@ts-ignore
                        priceChange: data?.priceChange ?? prevTickers?.[asset]?.priceChange ?? '',
                        //@ts-ignore
                        priceChangePercent: data?.priceChangePercent ?? prevTickers?.[asset]?.priceChangePercent ?? '',
                        //@ts-ignore
                        quoteVolume: data?.quoteVolume ?? prevTickers?.[asset]?.quoteVolume ?? '',
                        //@ts-ignore
                        symbol: data?.symbol ?? prevTickers?.[asset]?.symbol ?? '',
                        //@ts-ignore
                        trades: data?.trades ?? prevTickers?.[asset]?.trades ?? '',
                        //@ts-ignore
                        volume: data?.volume ?? prevTickers?.[asset]?.volume ?? '',
                    },
                }));
            },
            `TICKER-${asset}`
        );
    };

    const calculateProfitLoss = (holding: any, ticker: any) => {
        const { price, quantity } = holding;
        //@ts-ignore
        const currentPrice = ticker?.c ?? price;
        const profitOrLoss = (currentPrice - price) * quantity;
        return profitOrLoss;
    };

    // Handle Exit - Trigger Modal
    const handleExit = (asset: string) => {
        setSelectedAsset(asset);
        setShowModal(true); // Show the modal when exit is clicked
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedAsset(null);
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-white mb-4">Your Holdings</h2>
            {holdings.length > 0 ? (
                <div className="space-y-4">
                    {holdings.map((holding, index) => {
                        //@ts-ignore
                        const ticker = tickers[holding.asset] || {};
                        //@ts-ignore
                        const profitLoss = calculateProfitLoss(holding, ticker);
                        //@ts-ignore
                        const profitLossClass = profitLoss >= 0 ? "text-green-500" : "text-red-500";

                        return (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center space-x-4">
                                <div className="text-white">
                                    <p className="font-medium text-lg">Asset: {
                                    //@ts-ignore
                                    holding.asset}</p>
                                    <p className="text-sm text-gray-400">Quantity: {
                                    //@ts-ignore
                                    holding.quantity}</p>
                                    <p className="text-sm text-gray-400">Buy Price: ${
                                    //@ts-ignore
                                    holding.price.toFixed(2)}</p>
                                    <p className="text-sm text-gray-400">Current Price: ${
                                    //@ts-ignore
                                    ticker.c ?? holding.price.toFixed(2)}</p>
                                </div>
                                <div className={`text-lg font-semibold ${profitLossClass}`}>
                                    {profitLoss >= 0 ? `Profit: $${profitLoss.toFixed(2)}` : `Loss: $${Math.abs(profitLoss).toFixed(2)}`}
                                </div>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 focus:outline-none"
                                        //@ts-ignore
                                    onClick={() => handleExit(holding.asset)}
                                >
                                    Exit / Add More
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-gray-400 mt-4">No Holdings</div>
            )}

            {/* Modal for Swap UI */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-semibold text-white mb-4">Exit {
                        //@ts-ignore
                        selectedAsset}</h3>
                        <p className="text-gray-400 mb-4">Are you sure you want to exit your position in {
                        //@ts-ignore
                        selectedAsset}?</p>

                        {/* Render the SwapUI component inside the modal */}
                        <SwapUI
                            //@ts-ignore
                            market={selectedAsset}
                            // onClose={closeModal}
                        />

                        <div className="flex justify-between items-center mt-6">
                            <button
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Holdings;
