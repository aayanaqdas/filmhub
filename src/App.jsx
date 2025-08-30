import HeroCarousel from "./components/HeroCarousel/HeroCarousel";
import CardSection from "./components/CardSections/CardSection";
import { useEffect, useState } from "react";

export default function App() {
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const [trendingData, setTrendingData] = useState([]);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        const moviesAndTV = data.results.filter(item => item.media_type !== 'person');
        setTrendingData(moviesAndTV);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTrendingData();
  }, []);

  return (
    <main>
      <HeroCarousel />
      <div className="w-full flex flex-col items-center ">
        <CardSection sectionTitle="Trending this week" data={trendingData} />
      </div>
    </main>
  );
}
