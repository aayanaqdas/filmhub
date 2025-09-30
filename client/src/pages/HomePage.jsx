import HeroCarousel from "../components/HeroCarousel/HeroCarousel";
import CardSection from "../components/CardSections/CardSection";
import { useState } from "react";
import { useTrendingData } from "../hooks/useTrendingData";
import { usePopularData } from "../hooks/usePopularData";
import { useTopRatedTvData } from "../hooks/useTopRatedTvData";
import { usePopularPeopleData } from "../hooks/usePopularPeopleData";

export default function HomePage() {
  // State for each section's filters
  const [trendingFilters, setTrendingFilters] = useState({ timeWindow: "day" });
  const [popularFilters, setPopularFilters] = useState({ filter: "streaming" });

  // Hooks for each section
  const {
    data: trendingData,
    loading: trendingLoading,
    error: trendingError,
  } = useTrendingData(trendingFilters.timeWindow);
  const {
    data: popularData,
    loading: popularLoading,
    error: popularError,
  } = usePopularData(popularFilters.filter);
  const { data: tvData, loading: tvLoading, error: tvError } = useTopRatedTvData();
  const { data: peopleData, loading: peopleLoading, error: peopleError } = usePopularPeopleData();

  // Handlers for filter changes
  const handleTrendingFilterChange = (newFilters) => {
    setTrendingFilters(newFilters);
  };
  const handlePopularFilterChange = (newFilters) => {
    setPopularFilters(newFilters);
  };

  return (
    <main className="pt-12">
      <HeroCarousel />
      <div className="w-full flex flex-col items-center">
        <CardSection
          sectionTitle="Trending"
          data={trendingData}
          mediaType="all"
          filters={trendingFilters}
          hasFilterButton={true}
          filterKey="timeWindow"
          filterOptions={["day", "week"]}
          filterLabels={{ day: "Today", week: "This Week" }}
          onFilterChange={handleTrendingFilterChange}
          loading={trendingLoading}
          error={trendingError}
        />

        <CardSection
          sectionTitle="What's popular"
          data={popularData}
          mediaType="movie"
          filters={popularFilters}
          hasFilterButton={true}
          filterKey="filter"
          filterOptions={["streaming", "theatres"]}
          filterLabels={{ streaming: "On Streaming", theatres: "In Theatres" }}
          onFilterChange={handlePopularFilterChange}
          loading={popularLoading}
          error={popularError}
        />
        <CardSection
          sectionTitle="Top rated TV-Shows"
          data={tvData}
          mediaType="tv"
          hasFilterButton={false}
          loading={tvLoading}
          error={tvError}
        />
        <CardSection
          sectionTitle="Popular people"
          data={peopleData}
          mediaType="person"
          hasFilterButton={false}
          loading={peopleLoading}
          error={peopleError}
        />
      </div>
    </main>
  );
}
