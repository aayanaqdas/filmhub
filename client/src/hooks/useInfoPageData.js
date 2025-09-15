import { useEffect, useState } from "react";
import { tmdbApi } from "../services/tmdbApi";

export const useInfoPageData = (mediaType, id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);

        // Single API call with all data appended
        const appendToResponse =
          mediaType === "movie"
            ? "images,release_dates,credits,videos,similar,recommendations,watch/providers"
            : "images,content_ratings,credits,videos,similar,recommendations,watch/providers";

        const mediaDetails = await tmdbApi.getMediaDetails(mediaType, id, appendToResponse);

        setData(mediaDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (mediaType && id) {
      fetchMediaDetails();
    }
  }, [mediaType, id]);

  return { data, loading, error };
};
