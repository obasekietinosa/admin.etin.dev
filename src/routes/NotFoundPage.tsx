import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <section>
    <h1>Page not found</h1>
    <p>The page you are looking for does not exist yet.</p>
    <p>
      Return to the <Link to="/">dashboard</Link> to continue building the admin experience.
    </p>
  </section>
)

export default NotFoundPage
