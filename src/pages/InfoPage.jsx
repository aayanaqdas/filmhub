import CardSection from "../components/CardSections/CardSection";
import HeroSection from "../components/InfoPage/HeroSection";
import { useInfoPageData } from "../hooks/useInfoPageData";
import { useParams } from "react-router-dom";

export default function InfoPage() {
  const { mediaType, id } = useParams();
  const { data, loading, error } = useInfoPageData(mediaType, id);
  console.log(data);

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

  return (
    <div className="w-full h-full">
      <HeroSection data={data} mediaType={mediaType} />
    </div>
  );
}
