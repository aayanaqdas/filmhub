import StarRating from "../StarRating"

export default function Cards(){
    const title = "Eanie Meanie";
    const maxLength = 25;
    const truncatedTitle = title.length > maxLength ? title.substring(0, maxLength) + "..." : title;

    return (
        <div 
        className="w-36 h-50 sm:w-40 sm:h-60 md:w-44 md:h-65 lg:w-68 lg:h-84 rounded-md cursor-pointer flex-shrink-0 hover:scale-105 hover:z-10 transition-all duration-300 ease-in-out relative overflow-hidden shadow-2xl"
        style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original/12Va3oO3oYUdOd75zM57Nx1976a.jpg)`,
            backgroundSize: "100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}>

            <span className="absolute right-0 m-2 px-2 rounded-md text-primary-2 text-xs lg:text-sm bg-black/30">TV</span>
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="relative w-full h-full py-0.5 px-2 sm:px-3 md:px-4 flex flex-col justify-end">
                <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold leading-tight drop-shadow-lg">
                    {truncatedTitle}
                </h3>
                <p className="text-primary-2 text-xs sm:text-xs md:text-sm drop-shadow-md mb-1">
                    Thriller, Action, Comedy
                </p>
                <div className="scale-75 sm:scale-90 md:scale-100 origin-left">
                    <StarRating rating={4}/>
                </div>
            </div>
        </div>
    )
}