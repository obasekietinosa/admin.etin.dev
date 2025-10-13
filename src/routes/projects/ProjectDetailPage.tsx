import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { deleteProject, fetchProject } from '../../api/projects'

const isOngoing = (value?: string) => !value || value.startsWith('0001-01-01')

const formatDate = (value?: string) => {
  if (!value) {
    return 'Unknown'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const ProjectDetailPage = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const id = Number(projectId)

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id),
    enabled: Number.isFinite(id),
  })

  const { mutate: removeProject, isPending: isDeleting } = useMutation({
    mutationFn: deleteProject,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
        queryClient.invalidateQueries({ queryKey: ['project', id] }),
      ])
      navigate('..', { replace: true })
    },
  })

  if (!Number.isFinite(id)) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Invalid project identifier.</p>
      </div>
    )
  }

  if (isLoading) {
    return <p>Loading project…</p>
  }

  if (isError || !project) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Unable to load the requested project.</p>
        {error instanceof ApiError && <p>{error.message}</p>}
        <Link to=".." className="button button--secondary">
          Back to projects
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Delete ${project.title}? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    removeProject(project.id)
  }

  return (
    <article className="card stack stack--large">
      <header className="cluster cluster--between">
        <div>
          <p className="muted">Project #{project.id}</p>
          <h2 className="section-title">{project.title}</h2>
        </div>
        <div className="cluster">
          <Link to="edit" className="button button--secondary">
            Edit
          </Link>
          <button
            type="button"
            className="button button--danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </header>

      <section>
        <h3 className="section-subtitle">Timeline</h3>
        <p>
          {formatDate(project.startDate)} –{' '}
          {isOngoing(project.endDate) ? 'Present' : formatDate(project.endDate)}
        </p>
      </section>

      <section>
        <h3 className="section-subtitle">Description</h3>
        <p>{project.description || 'No description provided yet.'}</p>
      </section>

      <footer className="cluster">
        <Link to=".." className="button button--ghost">
          Back to list
        </Link>
      </footer>
    </article>
  )
}

export default ProjectDetailPage
