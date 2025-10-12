const AboutPage = () => (
  <section className="space-y-4 rounded-2xl border border-slate-600/20 bg-slate-900/70 p-8 shadow-soft-xl backdrop-blur">
    <h1 className="text-3xl font-semibold text-slate-50">About this project</h1>
    <p className="text-slate-300">
      admin.etin.dev is the administrative companion to the{' '}
      <a
        className="font-medium text-blue-300 transition-colors hover:text-blue-200"
        href="https://github.com/obasekietinosa/api.etin.dev"
        target="_blank"
        rel="noreferrer"
      >
        api.etin.dev
      </a>{' '}
      service. The stack combines Vite, React, TypeScript, React Router, and TanStack Query to deliver a fast foundation for
      building data-driven workflows.
    </p>
    <p className="text-slate-300">
      This starter keeps the surface area intentionally small so upcoming features—authentication, analytics, moderation tools,
      and more—can be layered on incrementally.
    </p>
  </section>
)

export default AboutPage
