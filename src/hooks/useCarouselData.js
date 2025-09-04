import { useEffect, useState } from "react";
import { tmdbApi } from "../services/tmdbApi";

export const useCarouselData = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resultAmount = 10;

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
        ].filter((item) => item.backdrop_path); // Filter out items without backdrop

        // Shuffle the array to mix movies and TV shows
        const shuffled = combinedMedia.sort(() => 0.5 - Math.random());

        // Get media details for the selected items
        const mediaWithDetails = await Promise.all(
          shuffled.map(async (media) => {
            try {
              // Fetch logo and certification in parallel
              const [imagesData, watchProviders, certificationData] = await Promise.all([
                tmdbApi.getMediaImages(media.media_type, media.id),
                tmdbApi.getWatchProviders(media.media_type, media.id),
                media.media_type === "movie"
                  ? tmdbApi.getMovieCertification(media.id)
                  : tmdbApi.getTVCertification(media.id),
              ]);

              // Get English logo
              const englishLogos = imagesData.logos.filter((logo) => logo.iso_639_1 === "en");
              const logoPath = englishLogos.length > 0 ? englishLogos[0].file_path : null;

              // Get certification based on media type
              let certification = "NR";

              if (media.media_type === "movie") {
                // For movies: look into release_dates
                const usRelease = certificationData.results.find(
                  (result) => result.iso_3166_1 === "US"
                );

                if (usRelease && usRelease.release_dates.length > 0) {
                  certification = usRelease.release_dates[0].certification || "NR";
                } else {
                  // Fallback to any other country with certification
                  for (const result of certificationData.results) {
                    if (result.release_dates.length > 0 && result.release_dates[0].certification) {
                      certification = result.release_dates[0].certification;
                      break;
                    }
                  }
                }
              } else {
                // For TV shows: look into results and rating
                const usRating = certificationData.results.find(
                  (result) => result.iso_3166_1 === "US"
                );

                if (usRating && usRating.rating) {
                  certification = usRating.rating;
                } else {
                  // Fallback to any other country with rating
                  for (const result of certificationData.results) {
                    if (result.rating) {
                      certification = result.rating;
                      break;
                    }
                  }
                }
              }

              const providers = watchProviders.results?.US || null;

              return {
                ...media,
                logoPath,
                certification,
                providers,
              };
            } catch (err) {
              console.log(`Error fetching details for media id ${media.id}:`, err);
              return {
                ...media,
                logoPath: null,
                certification: "NR",
                providers: null,
              };
            }
          })
        );

        // Filter out items without logos and take only the desired amount
        const itemsWithLogos = mediaWithDetails
          .filter((item) => item.logoPath)
          .slice(0, resultAmount);

        setCarouselItems(itemsWithLogos);
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
