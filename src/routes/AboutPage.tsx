const AboutPage = () => (
  <section className="card space-y-4">
    <header className="border-b border-border pb-4">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-bronze">
        Platform
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-foreground sm:text-3xl">
        About this project
      </h1>
    </header>
    <p className="leading-relaxed text-muted">
      admin.etin.dev is the administrative companion to the{' '}
      <a
        className="link"
        href="https://github.com/obasekietinosa/api.etin.dev"
        target="_blank"
        rel="noreferrer"
      >
        api.etin.dev
      </a>{' '}
      service. The stack combines Vite, React, TypeScript, React Router, and TanStack Query to
      deliver a fast foundation for building data-driven workflows.
    </p>
    <p className="leading-relaxed text-muted">
      This starter keeps the surface area intentionally small so upcoming features—authentication,
      analytics, moderation tools, and more—can be layered on incrementally.
    </p>
  </section>
)

export default AboutPage
