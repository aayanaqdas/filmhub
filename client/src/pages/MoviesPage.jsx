import { useState, useMemo } from "react";
import { useMoviePageData } from "../hooks/useMoviesPageData";
import Cards from "../components/CardSections/Cards";
import { watchProviders } from "../movieProviders";
import FilterBtns from "../components/DiscoverPages/FilterBtns";
import SortFilter from "../components/DiscoverPages/SortFilter";
import WhereToWatchFilter from "../components/DiscoverPages/ProvidersFilter";
import GenreFilter from "../components/DiscoverPages/GenreFilter";
import ReleaseDates from "../components/DiscoverPages/ReleaseDateFilter";

export default function MoviesPage() {
  const [filters, setFilters] = useState({
    providers: [],
    genres: [],
    dateFrom: null,
    dateTo: null,
    sortBy: "popularity.desc",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [expanded, setExpanded] = useState({
    sort: false,
    where: false,
    filters: true,
  });

  const { data, loading, error } = useMoviePageData("movie", appliedFilters);

  const region = localStorage.getItem("region") || "US";
  const providersForCountry = useMemo(
    () =>
      watchProviders.filter(
        (provider) =>
          provider.display_priorities && provider.display_priorities[region] !== undefined
      ),
    [region]
  );
  const cards = useMemo(
    () =>
      data?.map((media) => (
        <Cards
          key={media.id}
          id={media.id}
          mediaType={"movie"}
          posterPath={media.poster_path}
          title={media.title ? media.title : media.name}
          voteAverage={media.vote_average}
        />
      )),
    [data]
  );

  const handleShowResults = () => setAppliedFilters(filters);

  if (!data || loading) {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-2 border-t-transparent"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-lg text-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col sm:flex-row min-h-screen mt-20">
      {/* Sidebar */}
      <aside className="min-w-80 sm:max-w-80 p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary-2 mb-6 tracking-wide">Filters</h2>
        <FilterBtns
          title="Sort"
          expanded={expanded.sort}
          onClick={() => setExpanded((prev) => ({ ...prev, sort: !prev.sort }))}
        >
          <SortFilter filters={filters} setFilters={setFilters} />
        </FilterBtns>
        <FilterBtns
          title="Where to watch"
          expanded={expanded.where}
          onClick={() => setExpanded((prev) => ({ ...prev, where: !prev.where }))}
        >
          <WhereToWatchFilter
            filters={filters}
            setFilters={setFilters}
            providersForCountry={providersForCountry}
          />
        </FilterBtns>
        <FilterBtns
          title="Filters"
          expanded={expanded.filters}
          onClick={() => setExpanded((prev) => ({ ...prev, filters: !prev.filters }))}
        >
          <GenreFilter filters={filters} setFilters={setFilters} />
          <div className="mt-4">
            <ReleaseDates filters={filters} setFilters={setFilters} />
          </div>
        </FilterBtns>
        <button
          className="w-full text-primary-2 bg-primary rounded-lg py-3 cursor-pointer hover:bg-primary/80"
          onClick={handleShowResults}
        >
          Show Results
        </button>
      </aside>
      {/* Main Content */}
      <section className="flex-1 p-8 justify-center">
        <h1 className="font-bold text-3xl text-white mb-8 tracking-wide">Discover Movies</h1>
        <div className="flex flex-wrap gap-8">{cards}</div>
      </section>
    </main>
  );
}
