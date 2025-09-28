import { useState } from "react";
import { useMoviePageData } from "../hooks/useMoviesPageData";
import Cards from "../components/CardSections/Cards";
import RegionSelect from "../components/RegionSelect";
import { movieGenres } from "../genres";
import { watchProviders } from "../watchProviders";

export default function MoviesPage() {
  const { data, loading, error } = useMoviePageData("movie");
  const [expanded, setExpanded] = useState({
    sort: false,
    where: false,
    filters: false,
  });

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

  const region = JSON.parse(localStorage.getItem("region")) || "US";

  const providersForCountry = watchProviders.filter(
    (provider) => provider.display_priorities && provider.display_priorities[region] !== undefined
  );

  console.log(providersForCountry);

  const cards = data?.map((media) => (
    <Cards
      key={media.id}
      id={media.id}
      mediaType={"movie"}
      posterPath={media.poster_path}
      title={media.title ? media.title : media.name}
      voteAverage={media.vote_average}
    />
  ));

  function SortFilter() {
    return (
      <div>
        <p className="text-white">TEst</p>
      </div>
    );
  }

  function WhereToWatchFilter() {
    return (
      <div className="w-full mx-auto ">
        <label className="block font-medium text-primary-2 mb-2">Countries</label>
        <RegionSelect />
        <div className="grid grid-cols-3 gap-4 place-items-center mt-5">
          {providersForCountry.map((provider) => {
            return (
              <img
                src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                alt={provider.provider_name}
                key={provider.provider_id}
                className="w-15 h-15 rounded-xl"
              />
            );
          })}
        </div>
      </div>
    );
  }

  function GenreFilter() {
    return (
      <div>
        <label className="block font-medium text-primary-2 mb-2">Genres</label>
        <div className="flex flex-wrap gap-2">
          {movieGenres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              className="px-3 py-1 rounded-full border border-primary-2 text-sm bg-primary-2/10 text-primary-2 opacity-80"
              disabled
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Filter button wrapper
  const FilterBtns = ({ title, expanded, onClick, children }) => (
    <div>
      <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg ${
          expanded ? "rounded-b-none" : ""
        } bg-gray-800/80 
            hover:bg-gray-700/80 transition-colors shadow text-white font-semibold text-base cursor-pointer`}
      >
        <span className="flex items-center gap-2">{title}</span>
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          className={`w-5 h-5 transition-transform duration-200 ${
            expanded ? "rotate-0" : "rotate-270"
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && <div className="bg-gray-800/80 rounded-b-lg p-4">{children}</div>}
    </div>
  );

  return (
    <main className="flex min-h-screen mt-20">
      {/* Sidebar */}
      <aside className="min-w-80 max-w-80 p-6 space-y-4">
        <h2 className="text-xl font-bold text-primary-2 mb-6 tracking-wide">Filters</h2>
        <FilterBtns
          title="Sort"
          expanded={expanded.sort}
          onClick={() => setExpanded((prev) => ({ ...prev, sort: !prev.sort }))}
        >
          <SortFilter />
        </FilterBtns>
        <FilterBtns
          title="Where to watch"
          expanded={expanded.where}
          onClick={() => setExpanded((prev) => ({ ...prev, where: !prev.where }))}
        >
          <WhereToWatchFilter />
        </FilterBtns>
        <FilterBtns
          title="Filters"
          expanded={expanded.filters}
          onClick={() => setExpanded((prev) => ({ ...prev, filters: !prev.filters }))}
        >
          <GenreFilter />
        </FilterBtns>
      </aside>
      {/* Main Content */}
      <section className="flex-1 p-8 justify-center">
        <h1 className="font-bold text-3xl text-white mb-8 tracking-wide">Discover Movies</h1>
        <div className="flex flex-wrap gap-8">{cards}</div>
      </section>
    </main>
  );
}
