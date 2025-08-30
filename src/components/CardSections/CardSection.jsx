import Cards from "./cards";

export default function CardSection({ sectionTitle }) {
  const baseImgUrl = `https://image.tmdb.org/t/p/original`;
  return (
    <section className="w-full pt-5 ">
      <h1 className="text-primary-2 text-2xl md:text-3xlfont-bold mb-4 px-7">{sectionTitle}</h1>
      <div className="w-full flex gap-4 overflow-x-auto overflow-y-hidden pb-2 hide-scrollbar px-7 scroll-smooth ">
        <Cards />
      </div>
    </section>
  );
}
