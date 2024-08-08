import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import jwtDecode from "jwt-decode";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
// import { urlFor } from "../client";
import client from "../client";
import { fetchUser } from "../utils/fetchUser";

const Pin = ({ pin, pin: { postedBy, image, _id, destination, save } }) => {
  //   console.log("Image URL:", urlFor(image).width(250).url());
  // console.log("Pin Object:", pin);
  //   console.log(pin.image.asset.url);
  const [postHovered, setPostHovered] = useState(false);
  //   const [savingPost, setSavingPost] = useState(false);

  const navigate = useNavigate();

  const user = fetchUser();
  const decodedUser = jwtDecode(user);

  let alreadySaved = !!save?.filter(
    (item) => item.postedBy._id === decodedUser?.sub
  )?.length;

  // ex(userid) =1 saved [2,3,1] -> [1].length -> 1 -> !1 -> false -> !false -> true
  // ex(userid) =4 saved [2,3,1] -> [].length -> 0 -> !0 -> true -> !true -> false

  const savePin = (id) => {
    if (!alreadySaved) {
      //   setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: decodedUser?.sub,
            postedBy: {
              _type: "postedBy",
              _ref: decodedUser?.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          //   setSavingPost(false);
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-details/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          // src={urlFor(pin.image.asset.url).width(250).url()}
          src={pin.image.asset.url}
          width={250}
          alt="user-post"
          className="rounded-lg w-full"
        />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pd-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {/* {savingPost ? "saving" : "Save"} */}
                  Save
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-2 pr-2 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20
                    ? destination.slice(8, 17)
                    : destination.slice(8)}
                </a>
              )}
              {postedBy?._id === decodedUser?.sub && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold text-base rounded-3xl hover:shadow-md outline-none"
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          src={postedBy?.image}
          alt="user-profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
