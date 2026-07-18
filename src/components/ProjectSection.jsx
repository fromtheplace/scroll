import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { ProjectShorts } from './ProjectShorts.jsx'

const textVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const galleryVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 12 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 * i },
  }),
}

export const ProjectSection = forwardRef(function ProjectSection(
  { project, index, total, isActive },
  ref
) {
  return (
    <section
      ref={ref}
      id={project.id}
      className={`project-section ${isActive ? 'project-section-active' : ''}`}
      data-index={index}
    >
      <div className="project-reel mono">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>

      <div className="project-content">
        <motion.div
          className="project-text"
          initial="hidden"
          animate={isActive ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          <p className="project-meta mono">
            {project.client} - {project.year} - {project.role}
          </p>
          <h2 className="project-title">{project.title}</h2>
          <p className="project-description">{project.description}</p>
          <a className="project-cta" href={project.href}>
            View full project
            <span aria-hidden="true"> &rarr;</span>
          </a>
        </motion.div>

        <motion.div
          className="project-shorts-wrap"
          initial="hidden"
          animate={isActive ? 'visible' : 'hidden'}
          variants={textVariants}
        >
          <ProjectShorts videoIds={project.shortsIds} projectIsActive={isActive} />
        </motion.div>
      </div>

      {project.gallery?.length > 0 && (
        <div className="project-gallery">
          {project.gallery.map((src, i) => (
            <motion.img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              className="project-gallery-image"
              custom={i}
              initial="hidden"
              animate={isActive ? 'visible' : 'hidden'}
              variants={galleryVariants}
            />
          ))}
        </div>
      )}
    </section>
  )
})
