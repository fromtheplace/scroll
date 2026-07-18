import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const BackgroundVideoContext = createContext(null)

export function useBackgroundVideo() {
  const ctx = useContext(BackgroundVideoContext)
  if (!ctx) throw new Error('useBackgroundVideo must be used inside BackgroundVideoProvider')
  return ctx
}

// Two stacked <video> layers. The inactive layer preloads the next source in
// the background, then only once it can actually play do we crossfade, so
// there is never a black or frozen frame during the swap.
export function BackgroundVideoProvider({ children }) {
  const [layers, setLayers] = useState({
    front: 'A',
    src: { A: null, B: null },
  })
  const videoRefs = { A: useRef(null), B: useRef(null) }
  const pendingSrc = useRef(null)

  const setActiveVideo = useCallback((src) => {
    if (!src) return
    if (pendingSrc.current === src) return
    pendingSrc.current = src

    setLayers((prev) => {
      if (prev.src[prev.front] === src) return prev
      const backLayer = prev.front === 'A' ? 'B' : 'A'
      return { ...prev, src: { ...prev.src, [backLayer]: src } }
    })
  }, [])

  useEffect(() => {
    const backLayer = layers.front === 'A' ? 'B' : 'A'
    const backSrc = layers.src[backLayer]
    const video = videoRefs[backLayer].current
    if (!backSrc || !video) return

    let cancelled = false

    function crossfadeIn() {
      if (cancelled) return
      video.play().catch(() => {})
      setLayers((prev) => ({ ...prev, front: backLayer }))
    }

    if (video.readyState >= 3) {
      crossfadeIn()
    } else {
      video.addEventListener('canplaythrough', crossfadeIn, { once: true })
    }

    return () => {
      cancelled = true
      video.removeEventListener('canplaythrough', crossfadeIn)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers.src.A, layers.src.B])

  // preload adjacent project videos ahead of time so switching is instant
  const preload = useCallback((srcList) => {
    srcList.filter(Boolean).forEach((src) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'video'
      link.href = src
      if (!document.querySelector(`link[href="${src}"]`)) {
        document.head.appendChild(link)
      }
    })
  }, [])

  return (
    <BackgroundVideoContext.Provider value={{ setActiveVideo, preload }}>
      <div className="bg-video-stage" aria-hidden="true">
        {['A', 'B'].map((key) => (
          <motion.video
            key={key}
            ref={videoRefs[key]}
            className="bg-video-layer"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            src={layers.src[key] || undefined}
            animate={{ opacity: layers.front === key ? 1 : 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: layers.front === key ? 1 : 0 }}
          />
        ))}
        <div className="bg-video-scrim" />
      </div>
      {children}
    </BackgroundVideoContext.Provider>
  )
}
