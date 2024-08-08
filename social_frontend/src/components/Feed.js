import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { feedQuery, searchQuery } from "../utils/data";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);

      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading) return <Spinner message="Adding New Ideas to Your Feed!" />;

  if (!pins?.length)
    return (
      <div className="flex justify-center items-center h-420">
        <h2 className="text-2xl font-bold">No pins available!</h2>
      </div>
    );

  return (
    <div>
      <div>{pins && <MasonryLayout pins={pins} />}</div>
    </div>
  );
};

export default Feed;
