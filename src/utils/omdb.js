const API_KEY = "38296e77"; // your OMDb API key
const BASE_URL = "https://www.omdbapi.com/";

export const FALLBACK_POSTER = "https://via.placeholder.com/500x750?text=No+Image";

/**
 * omdbFetch({ query, page, type })
 */
export async function omdbFetch({ query, page = 1, type = "movie" }) {
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=${type}&page=${page}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OMDb API error: ${res.status}`);
  
  const data = await res.json();
  
  if (data.Response === "True") {
    return {
      results: data.Search,
      total_pages: Math.ceil(parseInt(data.totalResults, 10) / 10)
    };
  } else {
    return { results: [], total_pages: 1 };
  }
}
