import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import {
  Project,
  deleteProject,
  fetchProjects,
} from '../../api/projects'
import { ApiError } from '../../api/client'

const formatDate = (value?: string | null) => {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const isOngoing = (value?: string | null) =>
  !value || value.startsWith('0001-01-01')

const ProjectsListPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: projects,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  const {
    mutate: removeProject,
    isPending: isDeleting,
    variables: deletingProjectId,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })

  const handleDelete = (project: Project) => {
    const confirmed = window.confirm(
      `Delete ${project.title}? This action cannot be undone.`,
    )

    if (!confirmed) {
      return
    }

    removeProject(project.id)
  }

  return (
    <div className="stack stack--large">
      <div className="cluster cluster--between">
        <div>
          <h2 className="section-title">Project portfolio</h2>
          <p className="muted">
            {projects?.length ?? 0} project{projects && projects.length !== 1 ? 's' : ''}{' '}
            currently documented in the API.
          </p>
        </div>
        <button
          type="button"
          className="button button--primary"
          onClick={() => navigate('new')}
        >
          Add project
        </button>
      </div>

      {isLoading && <p>Loading projects…</p>}

      {isError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to load projects.</p>
          {error instanceof ApiError && <p>{error.message}</p>}
          <button
            type="button"
            className="button button--secondary"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {deleteError && (
        <div className="alert alert--error" role="alert">
          <p>Failed to delete the project. Please try again.</p>
          {deleteError instanceof ApiError && <p>{deleteError.message}</p>}
        </div>
      )}

      {projects && projects.length > 0 ? (
        <div className="card">
          <table className="table" aria-label="Projects">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Start</th>
                <th scope="col">End</th>
                <th scope="col">Description</th>
                <th scope="col" className="table__actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <th scope="row">
                    <Link to={`${project.id}`} className="link">
                      {project.title}
                    </Link>
                  </th>
                  <td>{formatDate(project.startDate)}</td>
                  <td>{isOngoing(project.endDate) ? 'Present' : formatDate(project.endDate)}</td>
                  <td>{project.description || 'No description yet.'}</td>
                  <td className="table__actions">
                    <div className="cluster">
                      <Link to={`${project.id}`} className="button button--ghost">
                        View
                      </Link>
                      <Link to={`${project.id}/edit`} className="button button--ghost">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="button button--danger"
                        onClick={() => handleDelete(project)}
                        disabled={isDeleting && deletingProjectId === project.id}
                      >
                        {isDeleting && deletingProjectId === project.id
                          ? 'Deleting…'
                          : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !isLoading && (
          <div className="empty-state">
            <h3>No projects yet</h3>
            <p>Document your first project to showcase the work happening behind the scenes.</p>
            <button
              type="button"
              className="button button--primary"
              onClick={() => navigate('new')}
            >
              Create project
            </button>
          </div>
        )
      )}
    </div>
  )
}

export default ProjectsListPage
