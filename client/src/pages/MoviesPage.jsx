import { useState } from "react";
import { useMoviePageData } from "../hooks/useMoviesPageData";
import Cards from "../components/CardSections/Cards";
import RegionSelect from "../components/RegionSelect";
import { movieGenres } from "../genres";
import { watchProviders } from "../movieProviders";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function MoviesPage() {
  const [filters, setFilters] = useState({
    providers: [],
    genres: [],
    dateFrom: null,
    dateTo: null,
    sortBy: "popularity.desc",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const { data, loading, error } = useMoviePageData("movie", appliedFilters);
  const [expanded, setExpanded] = useState({
    sort: false,
    where: false,
    filters: true,
  });

  console.log(filters);

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

  const handleShowResults = () => setAppliedFilters(filters);

  const region = localStorage.getItem("region") || "US";

  const providersForCountry = watchProviders.filter(
    (provider) => provider.display_priorities && provider.display_priorities[region] !== undefined
  );

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
    const sortOptions = [
      { value: "popularity.desc", label: "Popularity Descending" },
      { value: "popularity.asc", label: "Popularity Ascending" },
      { value: "vote_average.desc", label: "Rating Descending" },
      { value: "vote_average.asc", label: "Rating Ascending" },
      { value: "primary_release_date.desc", label: "Release Date Descending" },
      { value: "primary_release_date.asc", label: "Release Date Ascending" },
      { value: "title.asc", label: "Title A-Z Ascending" },
      { value: "title.desc", label: "Title Z-A Descending" },
    ];
    return (
      <div>
        <label className="block font-medium text-primary-2 mb-2">Sort By</label>
        <select
          className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary-2 transition-colors cursor-pointer"
          value={filters.sortBy}
          onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  function WhereToWatchFilter() {
    return (
      <div className="w-full mx-auto ">
        <label className="block font-medium text-primary-2 mb-2">Countries</label>
        <RegionSelect />
        <div className="flex flex-wrap gap-4 justify-center mt-5">
          {providersForCountry.map((provider) => {
            const isActive = filters.providers.includes(provider.provider_id);
            return (
              <img
                src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                alt={provider.provider_name}
                key={provider.provider_id}
                className={`w-13 h-13 rounded-xl cursor-pointer border-2 transition-all ${
                  isActive
                    ? "border-primary shadow-lg scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                onClick={() => {
                  setFilters((prev) => {
                    const already = prev.providers.includes(provider.provider_id);
                    return {
                      ...prev,
                      providers: already
                        ? prev.providers.filter((id) => id !== provider.provider_id)
                        : [...prev.providers, provider.provider_id],
                    };
                  });
                }}
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
          {movieGenres.map((genre) => {
            const isActive = filters.genres.includes(genre.id);
            return (
              <button
                key={genre.id}
                type="button"
                className={`px-3 py-1 border text-sm rounded-full cursor-pointer transition-all ${
                  isActive
                    ? "bg-primary text-primary-2 border-primary"
                    : "border-primary-2/20 text-primary-2 hover:bg-primary-2/10"
                }`}
                onClick={() => {
                  setFilters((prev) => {
                    const already = prev.genres.includes(genre.id);
                    return {
                      ...prev,
                      genres: already
                        ? prev.genres.filter((id) => id !== genre.id)
                        : [...prev.genres, genre.id],
                    };
                  });
                }}
              >
                {genre.name}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function ReleaseDates() {
    // Convert string/null to Date object for DatePicker
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

    return (
      <div className="border-t border-gray-800">
        <label className="block font-medium text-primary-2 mb-2">Release Dates</label>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-primary-2 text-left w-16">From</span>
            <DatePicker
              selected={fromDate}
              onChange={(date) =>
                setFilters((f) => ({
                  ...f,
                  dateFrom: date ? date.toISOString().slice(0, 10) : null,
                }))
              }
              dateFormat="dd-MM-yyyy"
              className="w-40 px-3 py-2 text-sm rounded-lg cursor-pointer text-gray-300 bg-gray-800 border border-gray-600 focus:outline-none"
              placeholderText="Select date"
              maxDate={toDate}
              isClearable
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-primary-2 text-left w-16">To</span>
            <DatePicker
              selected={toDate}
              onChange={(date) =>
                setFilters((f) => ({
                  ...f,
                  dateTo: date ? date.toISOString().slice(0, 10) : null,
                }))
              }
              dateFormat="dd-MM-yyyy"
              className="w-40 px-3 py-2 text-base rounded-lg cursor-pointer text-gray-300 bg-gray-800 border border-gray-600 focus:outline-none"
              placeholderText="Select date"
              minDate={fromDate}
              isClearable
            />
          </div>
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
    <main className="flex flex-col sm:flex-row min-h-screen mt-20">
      {/* Sidebar */}
      <aside className="min-w-80 sm:max-w-80 p-6 space-y-4">
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
          <div className="mt-4">
            <ReleaseDates />
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
