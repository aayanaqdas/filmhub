import { useEffect, useState } from "react";
import { tmdbApi } from "../services/tmdbApi";

export const useCarouselData = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        setLoading(true);
        const mediaWithDetails = await tmdbApi.getHomepageCarousel();
        setCarouselItems(mediaWithDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  return { carouselItems, loading, error };
};
