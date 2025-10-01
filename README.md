# 🎬 FilmHub

A modern, responsive movie and TV show discovery platform built with React and powered by The Movie Database (TMDB) API. Discover trending content, search for your favorites, and explore detailed information about movies, TV shows, and celebrities.

![FilmHub Banner](https://img.shields.io/badge/FilmHub-Movie%20Discovery%20Platform-blue?style=for-the-badge&logo=react)

## ✨ Features

### 🏠 **Homepage**

- **Hero Carousel**: Trending movies and TV shows with backdrop images
- **Trending Content**: Daily and weekly trending across all media types
- **Popular Sections**: Movies, TV shows, and people
- **Latest Trailers**: Filter by popular, streaming, or in theaters

### 🔍 **Search & Discovery**

- **Universal Search**: Search across movies, TV shows, and people
- **Advanced Filtering**: Genre, release date, watch providers, and sorting options
- **Discover Pages**: Separate discovery for movies and TV shows
- **Region-based Results**: Content tailored to your location

### 📱 **Media Details**

- **Comprehensive Info**: Plot, cast, crew, ratings, and reviews
- **Media Galleries**: High-quality images and videos
- **Watch Providers**: Streaming, rental, and purchase options
- **Similar Content**: Recommendations based on current selection
- **Season Details**: Episode information for TV shows

### 👤 **People Profiles**

- **Biography**: Detailed information about actors, directors, and crew
- **Filmography**: Complete list of movies and TV appearances
- **Photo Galleries**: Professional and promotional photos

### 🎨 **User Experience**

- **Responsive Design**: Optimized for all devices
- **Region Selection**: Customize content for different countries
- **Star Ratings**: Visual rating system
- **Interactive UI**: Smooth animations and transitions
- **Fast Loading**: Cached API responses and optimized images

## 🛠️ Tech Stack

### **Frontend**

- **React 19** - Modern UI library with latest features
- **Vite** - Fast build tool and development server
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Embla Carousel** - Smooth carousel components
- **Axios** - HTTP client for API requests

### **Backend**

- **Netlify Functions** - Serverless API endpoints
- **Node.js 18** - Runtime environment
- **Express.js** - Web framework (legacy server)
- **NodeCache** - In-memory caching for better performance
- **TMDB API** - Movie and TV data source

### **Deployment**

- **Netlify** - Static hosting and serverless functions
- **CDN** - Global content delivery
- **Automatic HTTPS** - SSL certificates
- **Branch Previews** - Deploy previews for pull requests

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/aayanaqdas/filmhub.git
   cd filmhub
   ```

2. **Install dependencies**

   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies (if using Express server)
   cd ../server
   npm install
   ```

3. **Environment Setup**

   For Netlify deployment, set environment variables in Netlify dashboard:

   ```
   TMDB_API_KEY=your_tmdb_api_key_here
   ```

   For local development with Express server, create `.env` file:

   ```bash
   cd server
   echo "TMDB_API_KEY=your_tmdb_api_key_here" > .env
   ```

### Development

#### **Option 1: Netlify Dev (Recommended)**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Start development server with serverless functions
cd filmhub
netlify dev
```

Access at: `http://localhost:8888`

#### **Option 2: Separate Client & Server**

```bash
# Terminal 1: Start client
cd client
npm run dev

# Terminal 2: Start Express server
cd server
npm run dev
```

- Client: `http://localhost:5173`
- API: `http://localhost:8080`

### Building for Production

```bash
cd client
npm run build
```

The build output will be in `client/dist/`.

## 📁 Project Structure

```
filmhub/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── CardSections/ # Media cards and galleries
│   │   │   ├── DiscoverPages/# Filter components
│   │   │   ├── HeroCarousel/ # Homepage carousel
│   │   │   └── InfoPage/     # Detail page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   └── assets/          # Images and icons
│   ├── public/              # Static assets
│   └── package.json
├── netlify/
│   └── functions/           # Serverless API endpoints
│       ├── details.js       # Media details
│       ├── discover.js      # Discovery with filters
│       ├── homepage-carousel.js
│       ├── latest-trailers.js
│       ├── now-playing.js
│       ├── person.js        # People profiles
│       ├── popular.js       # Popular content
│       ├── search.js        # Search functionality
│       ├── season-details.js# TV season details
│       ├── top-rated.js     # Top rated content
│       └── trending.js      # Trending content
├── server/                  # Legacy Express server
├── netlify.toml            # Netlify configuration
└── README.md
```

## 🌐 API Endpoints

### **Serverless Functions** (Production)

```
GET /api/homepage/carousel              # Homepage trending mix
GET /api/trending/{mediaType}           # Trending content
GET /api/popular/{mediaType}            # Popular content
GET /api/top-rated/{mediaType}          # Top rated content
GET /api/now-playing/{mediaType}        # Now playing content
GET /api/latest-trailers                # Movie trailers
GET /api/details/{mediaType}/{id}       # Media details
GET /api/person/{id}                    # Person details
GET /api/search/{mediaType}/{query}     # Search functionality
GET /api/discover/{mediaType}           # Discovery with filters
GET /api/details/tv/{id}/season/{num}   # Season details
```

### **Query Parameters**

- `region`: Country code (e.g., `US`, `GB`, `IN`)
- `page`: Page number for pagination
- `time_window`: `day` or `week` for trending
- `filter`: `popular`, `streaming`, `theatres` for trailers

## 🎨 Features in Detail

### **Hero Carousel**

- Displays 10 trending movies and TV shows
- Auto-rotation with manual navigation
- Backdrop images with gradient overlays
- Watch provider integration
- Genre and rating display

### **Advanced Search**

- Multi-type search (movies, TV, people, or all)
- Real-time suggestions
- Filter by popularity, rating, and release date
- Pagination support

### **Discovery System**

- Genre-based filtering
- Watch provider filtering (Netflix, Prime Video, etc.)
- Release date ranges
- Sort by popularity, rating, or release date
- Vote count thresholds

### **Responsive Design**

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Accessible design patterns

## 🚀 Deployment

### **Netlify (Recommended)**

1. **Connect Repository**

   - Link your GitHub repository to Netlify
   - Auto-deploys on every push to main branch

2. **Environment Variables**

   ```
   TMDB_API_KEY = your_api_key_here
   ```

3. **Build Settings** (Auto-configured via `netlify.toml`)
   ```
   Build command: cd client && npm install && npm run build
   Publish directory: client/dist
   Functions directory: netlify/functions
   ```

### **Custom Domain**

Update DNS records as provided by Netlify for custom domain setup.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **The Movie Database (TMDB)** for providing the comprehensive movie and TV data API
- **React Team** for the amazing UI library
- **Netlify** for seamless deployment and serverless functions
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub or contact the maintainer.

---

**Made with ❤️ by [Aayan Aqdas](https://github.com/aayanaqdas)**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/aayanaqdas/filmhub)
