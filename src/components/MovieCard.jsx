import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FALLBACK_POSTER } from '../utils/omdb';

export default function MovieCard({ item, mediaType, onOpen, isFav, onToggleFav }) {
  const poster = item.Poster !== 'N/A' ? item.Poster : FALLBACK_POSTER;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="movie-card"
    >
      <div className="poster-wrapper" onClick={() => onOpen(item)}>
        <img src={poster} alt={item.Title} className="poster" />

        <div className="fav-button-wrapper">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(item);
            }}
            className="fav-button"
          >
            {isFav ? <FaHeart className="fav-icon active" /> : <FaRegHeart className="fav-icon" />}
          </button>
        </div>
      </div>

      <div className="movie-info">
        <h3>{item.Title}</h3>
        <p>
          {item.Year} • ⭐ {item.imdbRating ?? '—'}
        </p>
        <button onClick={() => onOpen(item)} className="details-button">
          Details
        </button>
      </div>
    </motion.div>
  );
}
