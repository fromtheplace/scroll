import { useEffect, useMemo, useRef } from 'react'
import { BackgroundVideoProvider, useBackgroundVideo } from './components/BackgroundVideoManager.jsx'
import { ProjectSection } from './components/ProjectSection.jsx'
import { Nav } from './components/Nav.jsx'
import { Intro } from './components/Intro.jsx'
import { useSectionObserver } from './hooks/useSectionObserver.js'
import { useLenis } from './hooks/useLenis.js'
import { PROJECTS } from './data/projects.js'

function Experience() {
  useLenis()
  const { setActiveVideo, preload } = useBackgroundVideo()
  const { activeIndex, setRef } = useSectionObserver(PROJECTS.length, { threshold: 0.55 })
  const sectionRefs = useRef([])

  const activeProject = PROJECTS[activeIndex]

  useEffect(() => {
    if (!activeProject) return
    setActiveVideo(activeProject.heroVideo)

    const prev = PROJECTS[activeIndex - 1]
    const next = PROJECTS[activeIndex + 1]
    preload([prev?.heroVideo, next?.heroVideo])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  const jumpTo = (index) => {
    const el = document.getElementById(PROJECTS[index].id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Nav projects={PROJECTS} activeIndex={activeIndex} onJump={jumpTo} />

      <Intro onEnter={() => jumpTo(0)} />

      <main>
        {PROJECTS.map((project, i) => (
          <ProjectSection
            key={project.id}
            ref={(el) => {
              sectionRefs.current[i] = el
              setRef(i)(el)
            }}
            project={project}
            index={i}
            total={PROJECTS.length}
            isActive={i === activeIndex}
          />
        ))}
      </main>

      <footer className="site-footer mono">
        <span>&copy; {new Date().getFullYear()} from the place</span>
        <span>Single page, JSON-driven</span>
      </footer>
    </>
  )
}

export default function App() {
  const projectCount = useMemo(() => PROJECTS.length, [])
  if (projectCount === 0) {
    return <p className="empty-state">No projects configured yet. Add entries to src/data/projects.js.</p>
  }

  return (
    <BackgroundVideoProvider>
      <Experience />
    </BackgroundVideoProvider>
  )
}
