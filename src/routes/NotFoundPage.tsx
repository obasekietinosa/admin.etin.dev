import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <section className="card space-y-4">
    <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
      Page not found
    </h1>
    <p className="text-muted">The page you are looking for does not exist yet.</p>
    <p className="text-muted">
      Return to the{' '}
      <Link className="link" to="/">
        dashboard
      </Link>{' '}
      to continue building the admin experience.
    </p>
  </section>
)

export default NotFoundPage
