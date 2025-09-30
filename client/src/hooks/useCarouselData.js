import { useEffect, useState } from "react";
import { api } from "../services/api";

export const useCarouselData = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        setLoading(true);
        const mediaWithDetails = await api.getHomepageCarousel();
        setCarouselItems(mediaWithDetails);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.response?.data?.error || err.message;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  return { carouselItems, loading, error };
};
