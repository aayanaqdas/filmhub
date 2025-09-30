import HeroCarousel from "../components/HeroCarousel/HeroCarousel";
import CardSection from "../components/CardSections/CardSection";
import { useState } from "react";
import { useHomePageData } from "../hooks/useHomePageData";

export default function HomePage() {
  const [timeWindow, setTimeWindow] = useState("week");
  const { data, loading, error } = useHomePageData(timeWindow);

  const handleTimeWindowChange = (newTimeWindow) => {
    setTimeWindow(newTimeWindow);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-lg text-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <main>
        <div className="relative w-full h-[50vh] min-h-[500px] mt-5 overflow-hidden">
          <div className="w-full h-[70vh] flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-2 border-t-transparent"></div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="w-full pt-5 px-7">
            <div className="h-8 bg-gray-800 rounded mb-4 animate-pulse"></div>
            <div className="flex gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-36 h-50 bg-gray-800 rounded animate-pulse flex-shrink-0"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-12">
      <HeroCarousel />
      <div className="w-full flex flex-col items-center">
        <CardSection
          sectionTitle="Trending"
          data={data.trending}
          mediaType="all"
          timeWindow={timeWindow}
          hasFilterButton={true}
          onTimeWindowChange={handleTimeWindowChange}
        />
        <CardSection sectionTitle="Top rated TV-Shows" data={data.topRatedTv} mediaType="tv" />
        <CardSection sectionTitle="Popular people" data={data.popularPeople} mediaType="person" />
      </div>
    </main>
  );
}
