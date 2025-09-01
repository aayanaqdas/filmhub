import { useEffect, useState } from "react";
import { tmdbApi } from "../services/tmdbApi";

export const useHomePageData = () => {
  const [data, setData] = useState({
    trending: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [trending, topRatedTv, popularMovies] = await Promise.all([
          tmdbApi.getTrending(),
          tmdbApi.getTopRatedTv(),
          tmdbApi.getPopularMovies(),
        ]);

        setData({
          trending: trending.results.filter(item => item.media_type !== 'person'),
          topRatedTv: topRatedTv.results,
          popularMovies: popularMovies.results,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { data, loading, error };
};