import { FormEvent, useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'

type LocationState = {
  from?: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const fromLocation = (location.state as LocationState | null)?.from
  const redirectPath = fromLocation && fromLocation.length > 0 ? fromLocation : '/'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectPath])

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login({ email, password }),
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        setFormError(error.message)
        return
      }

      setFormError('An unexpected error occurred while signing in. Please try again.')
      console.error('Unhandled login error', error)
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    mutation.mutate({ email: email.trim(), password })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="card w-full max-w-md space-y-6 p-6 sm:p-8">
        <div className="space-y-2 border-b border-border pb-5 text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-bronze">
            ◆ admin.etin.dev
          </p>
          <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Administrator access
          </h1>
          <p className="text-sm text-muted">
            Sign in with your administrative credentials to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form__field">
            <label htmlFor="email" className="form__label">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="form__input"
              placeholder="admin@etin.dev"
              required
            />
          </div>

          <div className="form__field">
            <label htmlFor="password" className="form__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form__input"
              placeholder="••••••••"
              required
            />
          </div>

          {formError && (
            <p className="alert alert--error" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="button button--primary w-full"
          >
            {mutation.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
