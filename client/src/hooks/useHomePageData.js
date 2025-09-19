import { useEffect, useState } from "react";
import { api } from "../services/api";

export const useHomePageData = (timeWindow) => {
  const [data, setData] = useState({
    trending: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [trending, topRatedTv, popularPeople] = await Promise.all([
          api.getTrending(timeWindow),
          api.getTopRatedTv(),
          api.getPopularPeople(),
        ]);

        setData({
          trending: trending.data.results.filter((item) => item.media_type !== "person"),
          topRatedTv: topRatedTv.data.results,
          popularPeople: popularPeople.data.results,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [timeWindow]);

  return { data, loading, error };
};
