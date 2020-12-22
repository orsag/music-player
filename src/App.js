import React, {useRef, useState, useEffect} from 'react';
import './styles/app.scss';
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";
import data from "./data"


function App() {
  //Ref
  const audioRef = useRef(null);
  // State
  const [songs, setSongs] = useState(data());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false)
  const [libraryStatus, setLibraryStatus] = useState(false)

  useEffect(() => {
    if (!currentSong.active) {
      const newSongs = songs.map((song) => {
        if (song.id === currentSong.id) {
          return { ...song, active: true }
        } else {
          return { ...song, active: false}
        }
      })
      setSongs(newSongs)
    }
  }, [currentSong])

  return (
    <div className={`App ${libraryStatus ? 'library-active' : ''}`}>
      <Nav
        libraryStatus={libraryStatus}
        setLibraryStatus={setLibraryStatus}
      />
      <Song currentSong={currentSong} />
      <Player
        audioRef={audioRef}
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        songs={songs}
        setCurrentSong={setCurrentSong}
      />
      <Library
        songs={songs}
        setCurrentSong={setCurrentSong}
        audioRef={audioRef}
        isPlaying={isPlaying}
        libraryStatus={libraryStatus}
      />
    </div>
  );
}

export default App;
