"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  signUpAtom,
  tokenAtom,
  otpVerificationAtom,
} from "../../store/User";
import toast from "react-hot-toast";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../firebase";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";

function SignUp() {
  const [signUpData, setSignUpData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    MobileNumber: "",
    Password: "",
    ConfirmPassword: "",
    TransactionPin: "",
    ConfirmTransactionPin: "",
  });
  const [signUp, setSignUp] = useRecoilState(signUpAtom);
  const [otpVerificationData, setotpVerificatonData] = useRecoilState(
    otpVerificationAtom
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const router = useRouter();
  const token = useRecoilValue(tokenAtom);

  const changeHandler = (e: any) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const signUpHandler = async () => {
    const {
      FirstName,
      LastName,
      Email,
      MobileNumber,
      Password,
      ConfirmPassword,
      TransactionPin,
      ConfirmTransactionPin,
    } = signUpData;

    // Check if any required field is missing
    if (
      !FirstName ||
      !LastName ||
      !Email ||
      !MobileNumber ||
      !Password ||
      !ConfirmPassword ||
      !TransactionPin ||
      !ConfirmTransactionPin
    ) {
      toast.error("Please fill in all the fields");
      return;
    }

    // Check if Password and Confirm Password match
    if (Password !== ConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Check if Transaction Pin and Confirm Transaction Pin match
    if (TransactionPin !== ConfirmTransactionPin) {
      toast.error("Transaction Pins do not match");
      return;
    }

    try {
      //@ts-ignore
      const phone = "+91" + signUpData.MobileNumber;
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      toast.loading("Verifying Captcha");
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
      setSignUp(signUpData);
      setotpVerificatonData(confirmation);
      toast.dismiss();
      toast.success("Otp Sent");
      router.push("/verification");
    } catch (error) {
      toast.dismiss();
      console.log(error);
      console.log("SignUp FrontEnd Error");
      toast.error("Sign Up Failed");
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white w-full max-w-[600px] p-8 rounded-lg shadow-lg">
        <h2 className="text-[1.8rem] font-bold text-center mb-8 text-gray-900">
          Sign Up
        </h2>
        <form className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              className="flex-1 p-3 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="First Name"
              onChange={changeHandler}
              name="FirstName"
            />
            <input
              type="text"
              className="flex-1 p-3 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Last Name"
              onChange={changeHandler}
              name="LastName"
            />
          </div>
          <input
            type="email"
            className="w-full p-3 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Email"
            onChange={changeHandler}
            name="Email"
          />
          <input
            type="text"
            className="w-full p-3 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Mobile Number"
            onChange={changeHandler}
            name="MobileNumber"
            maxLength={10}
          />
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Password"
                onChange={changeHandler}
                name="Password"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                {!showPassword ? (
                  <IoEyeOutline
                    //@ts-ignore
                    className="cursor-pointer text-gray-500"
                    size={24}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <IoEyeOffOutline
                    //@ts-ignore
                    className="cursor-pointer text-gray-500"
                    size={24}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>
            </div>
            <div className="relative flex-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full p-3 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Confirm Password"
                onChange={changeHandler}
                name="ConfirmPassword"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                {!showConfirmPassword ? (
                  <IoEyeOutline
                    //@ts-ignore
                    className="cursor-pointer text-gray-500"
                    size={24}
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />
                ) : (
                  <IoEyeOffOutline
                    //@ts-ignore
                    className="cursor-pointer text-gray-500"
                    size={24}
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <input
                type={showPin ? "text" : "password"}
                className="w-full p-3 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Transaction Pin"
                onChange={changeHandler}
                name="TransactionPin"
                maxLength={4}
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                {!showPin ? (
                  <IoEyeOutline
                    //@ts-ignore
                    className="cursor-pointer text-gray-500"
                    size={24}
                    onClick={() => setShowPin(!showPin)}
                  />
                ) : (
                  <IoEyeOffOutline
                    //@ts-ignore
                    className="cursor-pointer text-gray-500"
                    size={24}
                    onClick={() => setShowPin(!showPin)}
                  />
                )}
              </div>
            </div>
            <div className="relative flex-1">
              <input
                type={showConfirmPin ? "text" : "password"}
                className="w-full p-3 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Confirm Pin"
                onChange={changeHandler}
                name="ConfirmTransactionPin"
                maxLength={4}
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                {!showConfirmPin ? (
                  <IoEyeOutline
                    //@ts-ignore
                    className="cursor-pointer text-gray-500"
                    size={24}
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                  />
                ) : (
                  <IoEyeOffOutline
                    //@ts-ignore
                    className="cursor-pointer text-gray-500"
                    size={24}
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                  />
                )}
              </div>
            </div>
          </div>
        </form>
        <button
          className="w-full mt-6 p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={signUpHandler}
        >
          Sign Up
        </button>
      </div>
      <div id="recaptcha" className="mt-6"></div>
    </div>
  );
}

export default SignUp;
