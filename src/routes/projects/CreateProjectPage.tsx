import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { Project, ProjectInput, createProject } from '../../api/projects'
import ProjectForm from './ProjectForm'

const CreateProjectPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    mutate: saveProject,
    isPending: isSaving,
    error,
  } = useMutation({
    mutationFn: (values: ProjectInput) => createProject(values),
    onSuccess: async (project: Project) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
        queryClient.invalidateQueries({ queryKey: ['project', project.id] }),
      ])
      navigate(`/projects/${project.id}`)
    },
  })

  return (
    <article className="card stack stack--large">
      <header>
        <h2 className="section-title">Create a new project</h2>
        <p className="muted">
          Capture a case study entry to keep the public portfolio fresh and accurate.
        </p>
      </header>

      {error instanceof ApiError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to save the project.</p>
          <p>{error.message}</p>
        </div>
      )}

      <ProjectForm
        onSubmit={(values) => saveProject(values)}
        isSubmitting={isSaving}
        submitLabel="Create project"
        secondaryAction={
          <button
            type="button"
            className="button button--ghost"
            onClick={() => navigate('..')}
          >
            Cancel
          </button>
        }
      />
    </article>
  )
}

export default CreateProjectPage
