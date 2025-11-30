
import axios from 'axios';

export const TMDB_CONFIG = {
    ACCESS_TOKEN: process.env.EXPO_ACCESS_TOKEN,
    BASE_URL: 'https://api.themoviedb.org/3',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_ACCESS_TOKEN}`,
    }
}

export const fetchMovies = async({query} : {query: string}) => {
    const endpoint = query ? `/search/movie?query=${query}` : `/trending/movie/week`;
    try {
        const response = await axios.get(`${TMDB_CONFIG.BASE_URL}${endpoint}`, {
            headers: TMDB_CONFIG.headers,
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}