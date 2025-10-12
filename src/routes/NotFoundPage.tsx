import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <section className="space-y-4 rounded-2xl border border-slate-600/20 bg-slate-900/70 p-8 text-slate-200 shadow-soft-xl backdrop-blur">
    <h1 className="text-3xl font-semibold text-slate-50">Page not found</h1>
    <p className="text-slate-300">The page you are looking for does not exist yet.</p>
    <p className="text-slate-300">
      Return to the{' '}
      <Link className="font-medium text-blue-300 transition-colors hover:text-blue-200" to="/">
        dashboard
      </Link>{' '}
      to continue building the admin experience.
    </p>
  </section>
)

export default NotFoundPage
