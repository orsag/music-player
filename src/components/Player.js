import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faAngleLeft, faAngleRight, faPause } from '@fortawesome/free-solid-svg-icons'
const BACK = 'skip-back'
const FORWARD = 'skip-forward'

const Player = ({ songs, currentSong, setCurrentSong, isPlaying, setIsPlaying, audioRef }) => {
  //State
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    // animationPercentage: 0,
  })
  //Event Handlers
  const onPlaySong = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  }

  const timeUpdateHandler = (e) => {
    const currentTime = e.target.currentTime
    const duration = e.target.duration
    const roundedCurrent = Math.round(currentTime)
    const roundedDuration = Math.round(duration)
    const animation = Math.round((roundedCurrent / roundedDuration) * 100)
    setSongInfo({
      ...songInfo,
      currentTime,
      duration,
      // animationPercentage: animation,
    })
  }

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value
    setSongInfo({
      ...songInfo,
      currentTime: e.target.value,
    })
  }

  const skipTrackHandler = async (direction) => {
    const currentSongIndex = songs.findIndex((song) => song.id === currentSong.id)
    if (direction === FORWARD) {
      await setCurrentSong(songs[(currentSongIndex + 1) % songs.length])
    }
    if (direction === BACK) {
      if ((currentSongIndex - 1) % songs.length === -1) {
        await setCurrentSong(songs[songs.length - 1])
        if (isPlaying) audioRef.current.play();
        return;
      }
      await setCurrentSong(songs[(currentSongIndex - 1) % songs.length])
    }
    if (isPlaying) audioRef.current.play();
  }

  const getTime = (time) => {
    return Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
  }

  const animationPercentage = (songInfo.currentTime / songInfo.duration) * 100;

  const trackAnimationStyle = {
    transform: `translateX(${animationPercentage}%)` //songInfo.animationPercentage
  }

  const songEndHandler = async () => {
    const currentSongIndex = songs.findIndex((song) => song.id === currentSong.id)
    await setCurrentSong(songs[(currentSongIndex + 1) % songs.length])
    if (isPlaying) audioRef.current.play()
  }

  return (
    <div className='player'>
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <div style={{background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`}} className="track">
          <input
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={dragHandler}
            type="range"
          />
          <div style={trackAnimationStyle} className="animate-track"/>
        </div>
        <p>{songInfo.duration ? getTime(songInfo.duration) : '0:00'}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          className="skip-back"
          size="2x"
          icon={faAngleLeft}
          onClick={() => skipTrackHandler(BACK)}
        />
        <FontAwesomeIcon
          onClick={onPlaySong}
          className="play"
          size="2x"
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          className="skip-forward"
          size="2x"
          icon={faAngleRight}
          onClick={() => skipTrackHandler(FORWARD)}
        />
      </div>
      <audio
        ref={audioRef}
        src={currentSong.audio}
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}>
        onEnded={songEndHandler}
      </audio>
    </div>
  )
}

export default Player
