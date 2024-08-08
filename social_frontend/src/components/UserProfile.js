import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import client from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology,cars";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyles =
  "bg-primary my-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created"); // Created || Saved
  const [activeBtn, setActiveBtn] = useState("Created");

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => setUser(data[0]));
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => setPins(data));
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => setPins(data));
    }
  }, [text, userId]);

  const handleLogout = () => {
    googleLogout(); // Perform the logout action
    localStorage.removeItem("connect-user"); // Clear local storage
    navigate("/login"); // Redirect to the home page or login page
  };

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }

  return (
    <>
      <div className="relative pb-2 h-full justify-center items-center">
        <div className="flex flex-col pb-5">
          <div className="relative flex flex-col mb-7">
            <div className="flex flex-col justify-center items-center">
              <img
                src={randomImage}
                alt="banner-pic"
                className="w-full h-370 xl:h-510 shadow-lg object-cover"
              />
              <img
                src={user.image}
                alt="user-profile"
                className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              />
              <h1 className="font-bold text-center text-3xl mt-3">
                {user.userName}
              </h1>
              <div className="absolute top-0 z-1 right-0 p-2">
                {userId === user._id && (
                  <button
                    type="button"
                    className="bg-white p-2 flex justify-center items-center gap-2 px-3 rounded-full cursor-pointer outline-none shadow-lg"
                    onClick={handleLogout}
                  >
                    Logout
                    <AiOutlineLogout color="red" fontSize={21} />
                  </button>
                )}
              </div>
            </div>
            <div className="text-center mb-7">
              <button
                type="button"
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn("Created");
                }}
                className={`${
                  activeBtn === "Created" ? activeBtnStyles : notActiveBtnStyles
                }`}
              >
                Created
              </button>
              <button
                type="button"
                onClick={(e) => {
                  setText(e.target.textContent);
                  setActiveBtn("Saved");
                }}
                className={`${
                  activeBtn === "Saved" ? activeBtnStyles : notActiveBtnStyles
                }`}
              >
                Saved
              </button>
            </div>

            {pins?.length ? (
              <div className="px-2">
                <MasonryLayout pins={pins} />
              </div>
            ) : (
              <div className="flex justify-center items-center font-bold w-full text-xl mt-2">
                No Pins Found!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
