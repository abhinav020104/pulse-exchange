"use client";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenAtom, userAtom } from "../../store/User";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Deposit = () => {
    const token = useRecoilValue(tokenAtom);
    const [user, setUser] = useRecoilState(userAtom);
    const [topUpData, setTopUpData] = useState({});
    const navigate = useRouter();

    const clickHandler = async () => {
        try {
            const order = await axios.post("https://pulse-api-server.codewithabhinav.online/api/v1/auth/order", {
                //@ts-ignore
                amount: topUpData.amount * 100,
                currency: "USD",
                receipt: Math.random().toString(),
            });

            var options = {
                key: "rzp_test_QVPFTAZ7OOAQ1V",
                //@ts-ignore
                amount: topUpData.amount * 100,
                currency: "USD",
                name: "Pulse Exchange",
                description: "Add Funds",
                image: "https://i.pinimg.com/474x/85/8a/eb/858aeb459e4f2c0a69036912a743468d.jpg",
                order_id: order.data.data.id,
                handler: async function (response: any) {
                    try {
                        toast.loading("Top Up In Process");
                        const validateRes = await axios.post("https://pulse-api-server.codewithabhinav.online/api/v1/auth/validate", response);
                        const updatedBalance = await axios.put("https://pulse-api-server.codewithabhinav.online/api/v1/auth/deposit", topUpData);
                        await axios.post("https://pulse-api-server.codewithabhinav.online/api/v1/setbalances", topUpData);

                        toast.dismiss();
                        toast.success("Top Up successful!");
                        localStorage.setItem("user", JSON.stringify(updatedBalance.data.data));
                        setUser(updatedBalance.data.data);
                        navigate.push("/");
                    } catch (error) {
                        toast.dismiss();
                        console.log(error);
                    }
                }
            };

            //@ts-ignore
            var rzp1 = new window.Razorpay(options);
            rzp1.on("payment.failed", function (response: any) {
                toast.error("Payment Failed. Please try again.");
                console.log(response.error);
            });
            rzp1.open();
        } catch (error) {
            toast.dismiss();
            console.log(error);
            console.log("Top up front end error!");
        }
    };

    const changeHandler = (e: any) => {
        e.preventDefault();
        setTopUpData({
            ...topUpData,
            [e.target.name]: e.target.value,
            //@ts-ignore
            userId: user.UserId,
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 overflow-hidden">
            <div className="flex flex-col items-center justify-center w-[400px] h-[300px] bg-white shadow-2xl rounded-lg p-8">
                <h1 className="text-[1.5rem] font-bold text-gray-800 mb-6">Add Funds</h1>
                <input
                    type="text"
                    className="w-full p-3 text-gray-700 bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Amount to Add"
                    onChange={changeHandler}
                    name="amount"
                    minLength={1}
                />
                <button className="w-full p-3 mt-8 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={clickHandler}>
                    Add Funds
                </button>
            </div>
        </div>
    );
};

export default Deposit;
