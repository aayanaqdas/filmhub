import HeroCarousel from "../components/HeroCarousel/HeroCarousel";
import CardSection from "../components/CardSections/CardSection";
import { useHomePageData } from "../hooks/useHomePageData";

export default function HomePage() {
  const { data, loading, error } = useHomePageData();

  if (loading) {
    return (
      <main>
        <div className="relative w-full h-[50vh] min-h-[500px] mt-5 overflow-hidden">
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-xl">Loading...</div>
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

  if (error) {
    return (
      <main>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500 text-xl">Error: {error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-12">
      <HeroCarousel />
      <div className="w-full flex flex-col items-center">
        <CardSection sectionTitle="Trending this week" data={data.trending} mediaType="all" />
        <CardSection sectionTitle="Top rated TV-Shows" data={data.topRatedTv} mediaType="tv" />
        <CardSection sectionTitle="Popular people" data={data.popularPeople} mediaType="person" />
      </div>
    </main>
  );
}
