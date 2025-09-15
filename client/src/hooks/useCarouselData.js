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

        // Fetch trending movies and TV shows separately
        const [trendingMovies, trendingTV] = await Promise.all([
          tmdbApi.getTrendingMovies(),
          tmdbApi.getTrendingTV(),
        ]);

        // Combine and filter out items without backdrop
        const combinedMedia = [
          ...trendingMovies.results.map((item) => ({ ...item, media_type: "movie" })),
          ...trendingTV.results.map((item) => ({ ...item, media_type: "tv" })),
        ].filter((item) => item.backdrop_path);

        // Shuffle the array to mix movies and TV shows
        const shuffled = combinedMedia.sort(() => 0.5 - Math.random());

        // Get media details for the selected items
        const mediaWithDetails = await Promise.all(
          shuffled.slice(0, 10).map(async (media) => {
            try {
              // Single API call with all data appended
              const appendToResponse = "images,release_dates,content_ratings,watch/providers";
              const mediaDetails = await tmdbApi.getMediaDetails(
                media.media_type,
                media.id,
                appendToResponse
              );

              return { ...mediaDetails, media_type: media.media_type };
            } catch (err) {
              console.log(`Error fetching details for media id ${media.id}:`, err);
              return {
                media,
                media_type: media.mediaType,
              };
            }
          })
        );

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
