import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FaFilm, FaTv } from 'react-icons/fa';
import { omdbFetch, FALLBACK_POSTER } from '../utils/omdb';
import MovieCard from '../components/MovieCard';
import DetailsModal from '../components/DetailsModal';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const [mediaType, setMediaType] = useState('movie');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem('movie_explorer_favs') || '[]')
  );

  const debRef = useRef(null);

  useEffect(() => {
    if (query) fetchResults(1, query, mediaType);
    else setResults([]);
  }, [mediaType, query]);

  useEffect(() => {
    localStorage.setItem('movie_explorer_favs', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFav = (item) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.imdbID === item.imdbID);
      return exists ? prev.filter(f => f.imdbID !== item.imdbID) : [item, ...prev];
    });
  };

  const isFav = (item) => favorites.some(f => f.imdbID === item.imdbID);

  const fetchResults = async (requestPage = 1, q = '', type = 'movie', append = false) => {
    if (!q) return;
    setLoading(true);
    try {
      const res = await omdbFetch({ query: q, page: requestPage, type });
      setTotalPages(res.total_pages);
      setPage(requestPage);
      setResults(prev => append ? [...prev, ...res.results] : res.results);
    } catch (err) {
      console.error(err);
      setResults([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (debRef.current) clearTimeout(debRef.current);
    debRef.current = setTimeout(() => {
      if (query) fetchResults(1, query, mediaType);
    }, 400);
    return () => clearTimeout(debRef.current);
  }, [query, mediaType]);

  const loadMore = () => {
    if (page < totalPages) fetchResults(page + 1, query, mediaType, true);
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <h1>
          <FaFilm className="logo-icon" /> Movie & TV Explorer
        </h1>

        <div className="tabs">
          <label>
            <input
              type="radio"
              name="mediaType"
              checked={mediaType === 'movie'}
              onChange={() => setMediaType('movie')}
            />
            <FaFilm /> Movies
          </label>
          <label>
            <input
              type="radio"
              name="mediaType"
              checked={mediaType === 'series'}
              onChange={() => setMediaType('series')}
            />
            <FaTv /> TV Series
          </label>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={`Search ${mediaType}...`}
        />
      </div>

      {/* Loading Indicator */}
      {loading && <div className="loading">Loading...</div>}

      {/* Movie/TV Show Grid */}
      <section className="movie-grid">
        <AnimatePresence>
          {results.map(item => (
            <MovieCard
              key={item.imdbID}
              item={{
                ...item,
                id: item.imdbID,
                title: item.Title,
                poster_path: item.Poster !== 'N/A' ? item.Poster : FALLBACK_POSTER,
                year: item.Year
              }}
              mediaType={mediaType}
              onOpen={setSelected}
              isFav={isFav(item)}
              onToggleFav={toggleFav}
            />
          ))}
        </AnimatePresence>
      </section>

      {/* Load More Button */}
      {page < totalPages && (
        <div className="load-more-container">
          <button onClick={loadMore} className="load-more-btn">Load more</button>
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selected && (
          <DetailsModal
            item={selected}
            mediaType={mediaType}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
