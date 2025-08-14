import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { omdbFetch, FALLBACK_POSTER } from '../utils/omdb';

export default function DetailsModal({ item, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const url = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&i=${item.imdbID}&plot=full`;
        const res = await fetch(url);
        const data = await res.json();
        if (!mounted) return;
        if (data.Response === "True") setDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [item]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow p-6 overflow-auto z-10"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-sm opacity-80">Close</button>
        {loading ? (
          <div className="py-20 text-center">Loading…</div>
        ) : details ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <img
                src={details.Poster !== 'N/A' ? details.Poster : FALLBACK_POSTER}
                alt={details.Title}
                className="w-full rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold">{details.Title}</h2>
              <p className="mt-4 text-sm">{details.Plot}</p>
              <p className="mt-2 text-xs text-slate-600">
                Year: {details.Year} • Genre: {details.Genre} • Director: {details.Director}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center">No details available.</div>
        )}
      </motion.div>
    </div>
  );
}
