"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import { tokenAtom, userAtom } from "@/store/User";

const Login = () => {
    const router = useRouter();
    const [token, setToken] = useRecoilState(tokenAtom);
    const [user, setUser] = useRecoilState(userAtom);
    const [loginData, setLoginData] = useState({});

    const loginHandler = async () => {
        try {
            toast.loading("Login in progress!");
            const response = await axios.post("https://pulse-api-server.codewithabhinav.online/api/v1/auth/login", loginData);
            localStorage.setItem("token", JSON.stringify(response.data.data.token));
            localStorage.setItem("user", JSON.stringify(response.data.data));
            setUser(response.data.data);
            setToken(response.data.data.token);
            toast.dismiss();
            toast.success("Login Successful!");
            router.push("/");
        } catch (error) {
            toast.dismiss();
            toast.error("Login Failed");
            console.error("Failed to Login", error);
        }
    };

    const changeHandler = (e:any) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login to Your Account</h2>
                <div className="space-y-6">
                    <input
                        type="text"
                        placeholder="Enter User Id"
                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        name="userId"
                        onChange={changeHandler}
                    />
                    <input
                        type="password"
                        placeholder="Enter Password"
                        className="w-full px-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        name="password"
                        onChange={changeHandler}
                    />
                    <button
                        className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={loginHandler}
                    >
                        Login
                    </button>
                </div>
                <p className="mt-4 text-sm text-center text-gray-600">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="font-bold text-blue-600 hover:underline">
                    Sign Up
                </a>
            </p>
            </div>
        </div>
    );
};

export default Login;
