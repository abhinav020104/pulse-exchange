"use client"
import { useState } from "react";
import { usePathname } from "next/navigation";
import { PrimaryButton, SuccessButton } from "./core/Button";
import { useRouter } from "next/navigation";
import { RecoilRoot, useRecoilState } from "recoil";
import { tokenAtom, userAtom } from "@/store/User";
import { LogoutModal } from "./LogoutModal";
export const Appbar = () => {
    const route = usePathname();
    const router = useRouter();
    const [token, setToken] = useRecoilState(tokenAtom);
    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
    const [user , setUser] = useRecoilState(userAtom)
    const loginNavigator = () => {
        router.push("/login");
    };

    const signUpNavigator = () => {
        router.push("/signup");
    };

    const openLogoutModal = () => {
        setLogoutModalOpen(true);
    };

    const closeLogoutModal = () => {
        setLogoutModalOpen(false);
    };

    const confirmLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null); 
        setUser({});
        closeLogoutModal();
        router.push("/");
    };

    return (
        <RecoilRoot>
            <div className="text-white border-b border-slate-800">
                <div className="flex justify-between items-center p-2">
                    <div className="flex">
                        <div className={`text-xl pl-4 flex flex-col justify-center cursor-pointer text-white`} onClick={() => router.push('/')}>
                            Pulse
                        </div>
                        <button onClick={() => router.push('/markets')}>
                            <div className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${route.startsWith('/markets') ? 'text-white' : 'text-slate-500'}`}>
                                Markets
                            </div>
                        </button>
                        <div className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${route.startsWith('/trade') ? 'text-white' : 'text-slate-500'}`} onClick={() => router.push('/trade/SOL_USD')}>
                            Trade
                        </div>
                    </div>
                    <div className="flex">
                        <div className="p-2 mr-2">
                            {
                                token !== null && (
                                    <div>
                                        <SuccessButton onClick={() => router.push("/deposit")}>Deposit</SuccessButton>
                                        <SuccessButton onClick={() => router.push("/holdings")}>My Holdings</SuccessButton>
                                        <PrimaryButton onClick={() => router.push("/account")}>My Account</PrimaryButton>
                                        <PrimaryButton onClick={openLogoutModal}>Logout</PrimaryButton>
                                    </div>
                                )
                            }
                            {
                                token === null && (
                                    <div>
                                        <PrimaryButton onClick={loginNavigator}>Login</PrimaryButton>
                                        <PrimaryButton onClick={signUpNavigator}>Sign Up</PrimaryButton>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Modal */}
            <LogoutModal isOpen={isLogoutModalOpen} onClose={closeLogoutModal} onConfirm={confirmLogout} />
        </RecoilRoot>
    );
};
