import { useState } from "react";
import CardSection from "../CardSections/CardSection";

export default function PersonInfo({ data, loading, error }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const faceImgUrl = "https://image.tmdb.org/t/p/w300_and_h300_face";

  if (loading) {
    return (
      <div className="w-full h-[70vh] bg-gray-800 animate-pulse flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500 text-xl">Error: {error}</div>
        </div>
      </div>
    );
  }
  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Biography truncation logic
  const CHARACTER_LIMIT = 500;
  const shouldTruncate = data?.biography && data.biography.length > CHARACTER_LIMIT;
  const displayBiography =
    shouldTruncate && !isExpanded
      ? data.biography.substring(0, CHARACTER_LIMIT).trim() + "..."
      : data?.biography;

  // Sort combined_credits.cast by vote count in descending order
  const sortedCastCredits = data.combined_credits?.cast
    ? [...data.combined_credits.cast].sort((a, b) => b.vote_count - a.vote_count)
    : [];

  // Sort combined_credits.crew by vote count in descending order
  const sortedCrewCredits = data.combined_credits?.crew
    ? [...data.combined_credits.crew].sort((a, b) => b.vote_count - a.vote_count)
    : [];

  // Filter out duplicates based on media id for cast
  const filteredCastCredits = [];
  const castMediaIds = new Set();

  for (const media of sortedCastCredits) {
    if (!castMediaIds.has(media.id)) {
      castMediaIds.add(media.id);
      filteredCastCredits.push(media);
    }
  }

  // Filter out duplicates based on media id for crew
  const filteredCrewCredits = [];
  const crewMediaIds = new Set();

  for (const media of sortedCrewCredits) {
    if (!crewMediaIds.has(media.id)) {
      crewMediaIds.add(media.id);
      filteredCrewCredits.push(media);
    }
  }

  return (
    <div className="w-full min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <img
              src={faceImgUrl + data.profile_path}
              alt={data.name}
              className="w-64 h-80 md:w-80 md:h-96 rounded-3xl object-cover shadow-2xl mx-auto lg:mx-0"
            />
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                {data.name}
              </h1>
              <p className="text-primary-2 text-lg md:text-xl">{data.known_for_department}</p>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.birthday && (
                <div className="p-4">
                  <h3 className="text-primary-2 text-sm font-semibold mb-1">Born</h3>
                  <p className="text-white">
                    {formatDate(data.birthday)}
                    {!data.deathday && ` (age ${calculateAge(data.birthday)})`}
                  </p>
                </div>
              )}

              {data.deathday && (
                <div className="p-4">
                  <h3 className="text-primary-2 text-sm font-semibold mb-1">Died</h3>
                  <p className="text-white">{formatDate(data.deathday)}</p>
                </div>
              )}

              {data.place_of_birth && (
                <div className="p-4">
                  <h3 className="text-primary-2 text-sm font-semibold mb-1">Place of Birth</h3>
                  <p className="text-white">{data.place_of_birth}</p>
                </div>
              )}

              <div className="p-4">
                <h3 className="text-primary-2 text-sm font-semibold mb-1">Gender</h3>
                <p className="text-white">{data.gender === 1 ? "Female" : "Male"}</p>
              </div>
            </div>

            {/* Also Known As */}
            {data.also_known_as && data.also_known_as.length > 0 && (
              <div className="p-4">
                <h3 className="text-primary-2 text-sm font-semibold mb-3">Also Known As</h3>
                <div className="flex flex-wrap gap-2">
                  {data.also_known_as.slice(0, 6).map((name, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-2/20 text-primary-2 text-sm rounded-full"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Biography Section */}
        {data.biography && (
          <div className="mb-12">
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-6">Biography</h2>
            <div className="p-6">
              <p className="text-primary-2 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {displayBiography}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded px-2 py-1 cursor-pointer"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filmography Sections */}
        {data.combined_credits && (
          <>
            {filteredCastCredits.length > 0 && (
              <CardSection
                sectionTitle="Known For (Acting)"
                data={filteredCastCredits.slice(0, 20)}
                mediaType="all"
              />
            )}

            {filteredCrewCredits.length > 0 && (
              <div className="mt-8">
                <CardSection
                  sectionTitle="Known For (Production)"
                  data={filteredCrewCredits.slice(0, 20)}
                  mediaType="all"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
