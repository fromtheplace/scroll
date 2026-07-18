import { useEffect, useRef, useState } from 'react'
import { loadYouTubeIframeAPI, registerPlayback, clearPlaybackIfActive } from '../lib/youtube'

// A single Short. Renders a thumbnail placeholder until it is near the
// viewport, then lazily instantiates a real YouTube IFrame API player.
// isActive controls whether this specific short is the one allowed to
// autoplay right now (only the first short of the active project, unless
// the visitor taps another one directly).
function ShortEmbed({ videoId, isActive, onSelect }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const [nearViewport, setNearViewport] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setNearViewport(true)
        })
      },
      { rootMargin: '200px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // instantiate the player once the embed is near viewport, or load a new
  // video into an existing player if videoId changes (e.g. primary embed
  // swapping to whichever short the visitor picked from the filmstrip)
  const currentVideoId = useRef(videoId)
  useEffect(() => {
    if (!nearViewport) return

    if (!playerRef.current) {
      let cancelled = false
      loadYouTubeIframeAPI().then((YT) => {
        if (cancelled || !containerRef.current) return
        playerRef.current = new YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            autoplay: 0,
            mute: 1,
            controls: 0,
            loop: 1,
            playlist: videoId,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: () => setReady(true),
          },
        })
        currentVideoId.current = videoId
      })
      return () => {
        cancelled = true
      }
    }

    if (ready && currentVideoId.current !== videoId) {
      currentVideoId.current = videoId
      try {
        playerRef.current.loadVideoById({ videoId })
        playerRef.current.mute()
        if (isActive) playerRef.current.playVideo()
      } catch (e) {
        // ignore
      }
    }

    return undefined
  }, [nearViewport, videoId, ready, isActive])

  // respond to this short becoming, or ceasing to be, the active playing short
  useEffect(() => {
    const player = playerRef.current
    if (!player || !ready) return

    if (isActive) {
      registerPlayback(player)
      try {
        player.mute()
        player.playVideo()
      } catch (e) {
        // player not ready yet, ignore
      }
    } else {
      try {
        player.pauseVideo()
      } catch (e) {
        // ignore
      }
      clearPlaybackIfActive(player)
    }
  }, [isActive, ready])

  // stop playback immediately on unmount
  useEffect(() => {
    return () => {
      const player = playerRef.current
      if (!player) return
      try {
        player.pauseVideo()
      } catch (e) {
        // ignore
      }
      clearPlaybackIfActive(player)
    }
  }, [])

  return (
    <button
      type="button"
      className={`short-embed ${isActive ? 'short-embed-active' : ''}`}
      onClick={() => onSelect(videoId)}
      aria-label="Play short"
    >
      {!nearViewport && (
        <img
          className="short-thumb"
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
        />
      )}
      <div className="short-embed-frame" ref={containerRef} />
      {!isActive && nearViewport && <span className="short-play-hint">Play</span>}
    </button>
  )
}

// A plain thumbnail used in the filmstrip beneath the primary embed. This
// never instantiates a live player, it only ever picks which video the
// primary embed above should load and autoplay.
function ShortEmbedThumb({ videoId, isSelected, onSelect }) {
  return (
    <button
      type="button"
      className={`short-thumb-btn ${isSelected ? 'short-thumb-btn-selected' : ''}`}
      onClick={() => onSelect(videoId)}
      aria-pressed={isSelected}
      aria-label="Choose this short"
    >
      <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" loading="lazy" />
    </button>
  )
}

// Public component. Pass the array of YouTube video IDs for one project and
// whether the parent project section is currently the active scroll section.
export function ProjectShorts({ videoIds, projectIsActive }) {
  const [selectedId, setSelectedId] = useState(videoIds[0])

  useEffect(() => {
    if (projectIsActive) {
      setSelectedId(videoIds[0])
    }
  }, [projectIsActive, videoIds])

  return (
    <div className="project-shorts">
      <div className="project-shorts-primary">
        <ShortEmbed videoId={selectedId} isActive={projectIsActive} onSelect={setSelectedId} />
      </div>
      {videoIds.length > 1 && (
        <div className="project-shorts-strip">
          {videoIds.map((id) => (
            <ShortEmbedThumb
              key={id}
              videoId={id}
              isSelected={id === selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
