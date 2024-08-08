import { useNavigate } from "react-router-dom";
import sharevideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import client from "../client";

import React from "react";

const Login = () => {
  const navigate = useNavigate();

  // const responseGoogle = (response) => {
  //   localStorage.setItem("connect-user", JSON.stringify(response.credential));
  //   const decoded = jwtDecode(response.credential);
  //   const { name, picture, sub } = decoded;
  //   console.log(decoded);
  //   const doc = {
  //     _id: sub,
  //     _type: "user",
  //     userName: name,
  //     image: picture,
  //   };
  //   client.createIfNotExists(doc).then(() => {
  //     navigate("/", { replace: true });
  //   });
  // };

  const responseGoogle = (response) => {
    if (response && response.credential) {
      localStorage.setItem("connect-user", JSON.stringify(response.credential));
      try {
        const decoded = jwtDecode(response.credential);
        const { name, picture, sub } = decoded;
        const doc = {
          _id: sub,
          _type: "user",
          userName: name,
          image: picture,
        };
        client.createIfNotExists(doc).then(() => {
          navigate("/", { replace: true });
        });
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    } else {
      console.error("Invalid response from Google Login");
    }
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={sharevideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="logo" width="130px" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              onSuccess={responseGoogle}
              onError={() => console.log("error")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
