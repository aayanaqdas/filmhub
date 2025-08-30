import HeroCarousel from "./components/HeroCarousel";
import CardSection from "./components/CardSections/CardSection";

export default function App() {
  return (
    <main>
      <HeroCarousel />
      <div className="w-full flex flex-col items-center ">
        <CardSection sectionTitle="Trending this week" />
      </div>
    </main>
  );
}
