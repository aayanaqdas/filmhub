# FilmHub

A movie and TV show discovery platform that lets you explore trending content, search for your favorite films and shows, and discover new entertainment with detailed information about cast, crew, and where to watch. Built with React and powered by The Movie Database (TMDB) API.

## Demo

[![FilmHub Demo](https://img.youtube.com/vi/-N-hww2Pe_0/0.jpg)](https://youtu.be/-N-hww2Pe_0)

*Click the image above to watch the demo video*

## Features

- Browse trending, popular, and top-rated movies and TV shows
- Search for movies, TV shows, and people
- Detailed information pages with cast, crew, and trailers
- Advanced filtering and discovery options
- Region-specific content and watch providers
- Responsive design for all devices

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend**: Netlify Functions or Express.js
- **API**: The Movie Database (TMDB)

## Installation

Choose your setup:

### Netlify Functions

1. **Prerequisites**
   - Node.js 18+
   - [TMDB API key](https://www.themoviedb.org/settings/api)
   - Netlify CLI: `npm install -g netlify-cli`

2. **Setup**
   ```bash
   git clone https://github.com/aayanaqdas/filmhub.git
   cd filmhub
   cd client && npm install
   ```

3. **Environment Variables**
   ```bash
   # Create .env file in root directory
   echo "TMDB_API_KEY=your_api_key_here" > .env
   ```

4. **Run**
   ```bash
   # From project root
   netlify dev
   ```
   Access at: `http://localhost:8888`

### Express Server

1. **Prerequisites**
   - Node.js 18+
   - [TMDB API key](https://www.themoviedb.org/settings/api)

2. **Setup**
   ```bash
   git clone https://github.com/aayanaqdas/filmhub.git
   cd filmhub
   
   # Install client dependencies
   cd client && npm install
   
   # Install server dependencies
   cd ../server && npm install
   ```

3. **Environment Variables**
   ```bash
   # Create .env file in server directory
   cd server
   echo "TMDB_API_KEY=your_api_key_here" > .env
   ```

4. **Run**
   ```bash
   # Terminal 1: Start server
   cd server && npm run dev
   
   # Terminal 2: Start client
   cd client && npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - API: `http://localhost:8080`

## Project Structure

```
filmhub/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # UI components
│   │   │   ├── NavBar.jsx       # Main navigation
│   │   │   ├── Footer.jsx       # Site footer
│   │   │   ├── RegionSelect.jsx # Region selector
│   │   │   ├── StarRating.jsx   # Rating display
│   │   │   ├── NavigationButton.jsx # Navigation utility
│   │   │   ├── CardSections/    # Card components
│   │   │   │   ├── Cards.jsx            # Generic card wrappers for multiple media types
│   │   │   │   ├── CardSection.jsx      # Card section container
│   │   │   │   ├── ImageCard.jsx        # Cards for images
│   │   │   │   ├── SearchCard.jsx       # Search result cards
│   │   │   │   ├── VideoCard.jsx        # Trailer/video cards
│   │   │   │   ├── ReviewCard.jsx       # Review display cards
│   │   │   │   └── MediaGallerySection.jsx # Media gallery container
│   │   │   ├── DiscoverPages/   # Discovery filters
│   │   │   │   ├── FilterBtns.jsx       # Filter buttons
│   │   │   │   ├── GenreFilter.jsx      # Genre selection
│   │   │   │   ├── ProvidersFilter.jsx  # Streaming providers
│   │   │   │   ├── SortFilter.jsx       # Sort options
│   │   │   │   └── ReleaseDateFilter.jsx # Date filtering
│   │   │   ├── HeroCarousel/    # Homepage carousel
│   │   │   │   ├── HeroCarousel.jsx     # Main carousel component
│   │   │   │   ├── HeroSlide.jsx        # Individual slide
│   │   │   │   └── DotsIndicator.jsx    # Slide indicators
│   │   │   └── InfoPage/        # Detail page components
│   │   │       ├── HeroSection.jsx      # Media hero section
│   │   │       ├── PersonInfo.jsx       # Person details
│   │   │       ├── CollectionPage.jsx   # Movie collections
│   │   │       ├── SeasonInfoPage.jsx   # TV season details
│   │   │       ├── EpisodeCards.jsx     # Episode listings
│   │   │       ├── WatchProviders.jsx   # Streaming availability
│   │   │       ├── VideoModal.jsx       # Video modal
│   │   │       ├── ImageModal.jsx       # Image gallery modal
│   │   │       ├── MediaGalleryFilters.jsx # Gallery filter controls
│   │   │       └── ReviewsSection.jsx   # Reviews display
│   │   ├── pages/               # Route components
│   │   │   ├── HomePage.jsx     # Homepage with trending content
│   │   │   ├── DiscoverPage.jsx # Advanced filtering page
│   │   │   ├── InfoPage.jsx     # Media details page
│   │   │   ├── SearchPage.jsx   # Search results page
│   │   │   └── NotFoundPage.jsx # 404 page
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useCarouselData.js      # Homepage carousel data
│   │   │   ├── useTrendingData.js      # Trending content
│   │   │   ├── usePopularData.js       # Popular content
│   │   │   ├── usePopularPeopleData.js # Popular people data
│   │   │   ├── useTopRatedTvData.js    # Top rated TV shows
│   │   │   ├── useLatestData.js        # Latest trailers
│   │   │   ├── useDiscoverPageData.js  # Discovery filters
│   │   │   ├── useSearchPageData.js    # Search functionality
│   │   │   └── useInfoPageData.js      # Media details
│   │   ├── services/            # API service
│   │   │   └── api.js           # TMDB API calls
│   │   ├── assets/              # Static assets (icons, images)
│   │   ├── App.jsx              # Main app component
│   │   ├── index.jsx            # App entry point
│   │   ├── index.css            # Global styles
│   │   ├── countries.js         # Country/region data
│   │   ├── genres.js            # Genre mappings
│   │   ├── movieProviders.js    # Movie streaming providers
│   │   └── tvProviders.js       # TV streaming providers
│   ├── public/                  # Static public assets
│   └── package.json
├── netlify/
│   └── functions/               # Serverless functions
├── server/                      # Express server (alternative)
├── netlify.toml                # Netlify configuration
└── README.md
```

## API Endpoints

### Content Discovery
- `/api/homepage/carousel` - Homepage trending mix of movies and TV shows
- `/api/trending/{mediaType}?time_window={day|week}` - Trending content by time window
- `/api/popular/{mediaType}` - Popular movies, TV shows, or people
- `/api/top-rated/{mediaType}` - Top rated content
- `/api/now-playing/{mediaType}` - Movies currently in theaters
- `/api/latest-trailers?filter={popular|streaming|theatres}` - Movie trailers

### Media Details
- `/api/details/{mediaType}/{id}` - Detailed information for movies, TV shows, people and movie collections
- `/api/details/tv/{id}/season/{seasonNumber}` - TV season details and episodes

### Search & Discovery
- `/api/search/{mediaType}/{query}?page={number}` - Search for movies, TV shows, people, or multi
- `/api/discover/{mediaType}` - Advanced filtering with genre, provider, date, and sort options

### Supported Media Types
- `movie` - Movies
- `tv` - TV Shows  
- `person` - Actors, directors, crew
- `collection` - Movies that are part of a collection
- `multi` - Search across all types
- `all` - For trending content

### Query Parameters
- `region` - Content region (default: US)
- `time_window` - For trending: day or week
- `page` - For paginated results
- `filter` - For trailers: popular, streaming, theatres
- `sort_by` - For discover: popularity.desc, vote_average.desc, etc.
- `with_genres` - Genre filter (pipe-separated IDs)
- `with_watch_providers` - Streaming provider filter
- `vote_count.gte` - Minimum vote count
- `primary_release_date.gte/lte` - Date range filters
