import { useEffect, useState } from "react";
import { api } from "../services/api";

export const useInfoPageData = (mediaType, id, seasonNumber) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        if (mediaType === "tv" && seasonNumber) {
          const mediaDetails = await api.getSeasonDetails(mediaType, id, seasonNumber);
          setData(mediaDetails.data);
        } else {
          const mediaDetails = await api.getMediaDetails(mediaType, id);
          setData(mediaDetails.data);
        }
      } catch (err) {
        const tmdbMessage = err.response?.data?.message;
        setError(tmdbMessage || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (mediaType && id) {
      fetchMediaDetails();
    }
  }, [mediaType, id, seasonNumber]);

  return { data, loading, error };
};
