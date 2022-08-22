
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import MovieCard from './components/MovieCard';
import YouTube from 'react-youtube';




function App() {

  const API_KEY = 'de4fc3fc51348193a8935be458aa93b4';
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/w1280'
  const API_URL = 'https://api.themoviedb.org/3';
  const [movies, setMovies] = useState( [])
  const [selectedMovie, setSelectedMovie] = useState( {})
  const [searchKey, setSearchKey] = useState( '')

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? 'search' : 'discover/'
    const {data: {results}} = await axios.get(`${API_URL}/${type}movie/`, {
      params: {
        api_key: API_KEY,
        query: searchKey
      }
    })
    setSelectedMovie(results[0])
    setMovies(results)
  }

  const fetchMovie = async (id) => {
     const {data} = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: 'videos'
      }
     })
     return data
  }

  const selectMovie = async (movie) => {
    const data = await fetchMovie(movie.id)
    console.log('movie data', data);
    setSelectedMovie(movie)
  }
  
  useEffect(() => {
    fetchMovies()
  }, [])

  const renderMovies = () => (
    movies.map(movie => (
      <MovieCard
        key={movie.id}
        movie={movie}
        selectMovie={selectMovie}
      />
    ))
  )

  const searchMovies = (e) => {
    e.preventDefault()
    fetchMovies(searchKey)
  }

  const renderTrailer = () => {
    const trailer = selectedMovie.videos.results.find(vid => vid.name === 'Official Trailer')
    
    return (
      <YouTube 
        videoId={trailer.key}
      />
    )
  }

  return (
    <div className="App">
      <header className={'header'}>
        <div className={'header-content max-center'}>
        <h1>Movie Trailers</h1>
        <form onSubmit={searchMovies}>
          <input type='text' onChange={(e) => setSearchKey(e.target.value)}/>
          <button type={'submit'} >Search!</button>
        </form>
        </div>
      </header>

      <div className='hero' style={{backgroundImage: `url('${IMAGE_PATH}${selectedMovie.backdrop_path}')`}}>
        <div className='hero-content max-center'>
      
          {selectedMovie.videos ? renderTrailer() : null}
      
          <button className={'button'}>Play Trailer</button>
          <h1 className={'hero-title'}>{selectedMovie.title}</h1>
          {selectedMovie.overview ? <p className={'hero-overview'}>{selectedMovie.overview}</p> : null}
        </div>
      </div>

      <div className='container max-center'>
        {renderMovies()}
      </div>
    </div>
  );
}


export default App;



