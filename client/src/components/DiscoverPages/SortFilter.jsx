export default function SortFilter({ filters, setFilters, mediaType }) {
  const movieSortOptions = [
    { value: "popularity.desc", label: "Popularity Descending", voteCountGte: 200 },
    { value: "popularity.asc", label: "Popularity Ascending", voteCountGte: 200 },
    { value: "vote_average.desc", label: "Rating Descending", voteCountGte: 200 },
    { value: "vote_average.asc", label: "Rating Ascending", voteCountGte: 200 },
    { value: "primary_release_date.desc", label: "Release Date Descending" },
    { value: "primary_release_date.asc", label: "Release Date Ascending" },
    { value: "title.asc", label: "Title A-Z" },
    { value: "title.desc", label: "Title Z-A" },
  ];

  const tvSortOptions = [
    { value: "popularity.desc", label: "Popularity Descending", voteCountGte: 200 },
    { value: "popularity.asc", label: "Popularity Ascending", voteCountGte: 200 },
    { value: "vote_average.desc", label: "Rating Descending", voteCountGte: 200 },
    { value: "vote_average.asc", label: "Rating Ascending", voteCountGte: 200 },
    { value: "first_air_date.desc", label: "First Air Date Descending" },
    { value: "first_air_date.asc", label: "First Air Date Ascending" },
    { value: "name.asc", label: "Name A-Z" },
    { value: "name.desc", label: "Name Z-A" },
  ];

  const sortOptions = mediaType === "tv" ? tvSortOptions : movieSortOptions;

  const handleSortChange = (e) => {
    const selectedOption = sortOptions.find((opt) => opt.value === e.target.value);
    setFilters((f) => ({
      ...f,
      sortBy: selectedOption.value,
      voteCountGte: selectedOption.voteCountGte || null, // Set voteCountGte if present
    }));
  };

  return (
    <div>
      <label className="block font-medium text-primary-2 mb-2">Sort By</label>
      <select
        className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary-2 transition-colors cursor-pointer"
        value={filters.sortBy}
        onChange={handleSortChange} // Use custom handler
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
