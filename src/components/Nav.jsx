import { studio } from '../data/projects.js'

export function Nav({ projects, activeIndex, onJump }) {
  return (
    <header className="site-nav">
      <a className="site-nav-logo" href="#top">
        {studio.name}
      </a>

      <nav className="site-nav-dots" aria-label="Projects">
        {projects.map((project, i) => (
          <button
            key={project.id}
            type="button"
            className={`site-nav-dot ${i === activeIndex ? 'site-nav-dot-active' : ''}`}
            onClick={() => onJump(i)}
            aria-current={i === activeIndex ? 'true' : undefined}
            aria-label={`Jump to ${project.title}`}
          >
            <span className="site-nav-dot-mark" />
            <span className="site-nav-dot-label mono">{project.title}</span>
          </button>
        ))}
      </nav>

      <a className="site-nav-contact mono" href={`mailto:${studio.contact}`}>
        {studio.contact}
      </a>
    </header>
  )
}
