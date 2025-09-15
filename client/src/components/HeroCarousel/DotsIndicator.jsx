// filepath: /Users/aqdas/Documents/aayan_projects/filmhub/src/components/HeroCarousel/DotsIndicator.jsx
export default function DotsIndicator({ items, selectedIndex, onDotClick }) {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
      {items.map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            index === selectedIndex ? "bg-primary-2" : "bg-gray hover:bg-primary-2"
          }`}
        />
      ))}
    </div>
  );
}
