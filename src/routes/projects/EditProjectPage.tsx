import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { uploadAsset } from '../../api/assets'
import { ApiError } from '../../api/client'
import {
  Project,
  fetchProject,
  updateProject,
} from '../../api/projects'
import { ItemNotesManager } from '../../components/ItemNotesManager'
import ProjectForm, {
  ProjectFormInitialValues,
  ProjectSubmitValues,
} from './ProjectForm'

const toDateInputValue = (value?: string | null) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime()) || date.getUTCFullYear() === 1) {
    return ''
  }

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const EditProjectPage = () => {
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

  const initialFormValues = useMemo<ProjectFormInitialValues | null>(() => {
    if (!project) {
      return null
    }

    return {
      title: project.title,
      description: project.description,
      startDate: toDateInputValue(project.startDate),
      endDate: toDateInputValue(project.endDate),
      imageUrl: project.imageUrl,
    }
  }, [project])

  const {
    mutate: saveProject,
    isPending: isSaving,
    error: updateError,
  } = useMutation({
    mutationFn: async (values: ProjectSubmitValues) => {
      const { imageFile, ...projectInput } = values

      let imageUrl = projectInput.imageUrl

      if (imageFile) {
        const asset = await uploadAsset({ file: imageFile })
        imageUrl = asset.url
      }

      return updateProject(id, { ...projectInput, imageUrl })
    },
    onSuccess: async (updatedProject: Project) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
        queryClient.invalidateQueries({ queryKey: ['project', id] }),
      ])
      navigate(`/projects/${updatedProject.id}`)
    },
  })

  if (!Number.isFinite(id)) {
    return (
      <div className="alert alert--error" role="alert">
        <p>Invalid project identifier.</p>
        <Link to=".." className="button button--secondary">
          Back to projects
        </Link>
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

  return (
    <article className="card stack stack--large">
      <header>
        <h2 className="section-title">Edit project</h2>
        <p className="muted">
          Adjust the content below and save to update the public portfolio entry.
        </p>
      </header>

      {updateError instanceof ApiError && (
        <div className="alert alert--error" role="alert">
          <p>Unable to save the project.</p>
          <p>{updateError.message}</p>
        </div>
      )}

      <ProjectForm
        onSubmit={(values) => saveProject(values)}
        isSubmitting={isSaving}
        submitLabel="Save changes"
        initialValues={initialFormValues ?? undefined}
        secondaryAction={
          <button
            type="button"
            className="button button--ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        }
      />

      <ItemNotesManager itemId={id} itemType="projects" />
    </article>
  )
}

export default EditProjectPage
