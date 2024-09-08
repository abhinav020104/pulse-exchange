"use client"
import { RecoilRoot } from "recoil";
import {useEffect} from "react"
import axios from "axios"
const RecoilContextProvider = ({children}: Readonly<{ children: React.ReactNode;}>)=>{
    const token = localStorage.getItem("token");
    const fetchUser = async() =>{
        // toast.loading("Login in progress !");
        try{
            const response = await axios({
                method:"post",
                    url:"http://localhost:3000/api/v1/auth/getUserDetails",
                    data:{
                      token:token
                    }
                })
                localStorage.setItem("user" , JSON.stringify(response.data.data));
                // setUser(response.data.data);
                // console.log(user);
        }catch(error){
            console.log(error); 
        }
}
    useEffect(()=>{
    // toast.loading("Fetching User!");
    fetchUser();
    // toast.dismiss();
// console.log(user)
} , [token])
    return(
        <RecoilRoot>
            {children}
        </RecoilRoot>
    )
}

export default RecoilContextProvider;