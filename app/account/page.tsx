"use client";
import { userAtom } from "@/store/User";
import { useRecoilState } from "recoil";
import { useEffect } from "react";

const Account = () => {
    const [user, setUser] = useRecoilState(userAtom);
    console.log(user); 
    useEffect(() => {
        console.log("update!");
    }, [user]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-[90%] sm:w-[60%] md:w-[40%] lg:w-[30%] bg-white shadow-lg rounded-lg p-6">
                <div className="text-[1.5rem] text-gray-800 font-semibold mb-4 text-center">
                    My Account
                </div>
                <div className="text-[1.5rem] text-green-600 font-bold text-center mb-6">
                    {`$ ${user.Balance}`}
                </div>
                <div className="flex items-center justify-between text-[1rem] text-gray-700 mb-2">
                    <div className="font-medium">User ID :</div>
                    <div>{user.UserId}</div>
                </div>
                <div className="flex items-center justify-between text-[1rem] text-gray-700 mb-2">
                    <div className="font-medium">First Name :</div>
                    <div>{user.FirstName}</div>
                </div>
                <div className="flex items-center justify-between text-[1rem] text-gray-700 mb-2">
                    <div className="font-medium">Last Name :</div>
                    <div>{user.LastName}</div>
                </div>
                <div className="flex items-center justify-between text-[1rem] text-gray-700 mb-2">
                    <div className="font-medium">Email :</div>
                    <div>{user.Email}</div>
                </div>
            </div>
        </div>
    );
};

export default Account;
