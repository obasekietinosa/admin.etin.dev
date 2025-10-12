import { useQuery } from '@tanstack/react-query'

interface WelcomeMessage {
  message: string
  nextSteps: string[]
}

const fetchWelcomeMessage = async (): Promise<WelcomeMessage> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 300)
  })

  return {
    message: 'The admin interface foundation is ready.',
    nextSteps: [
      'Connect to the api.etin.dev backend.',
      'Replace this placeholder dashboard with real widgets.',
      'Share TanStack Query hooks across upcoming routes.',
    ],
  }
}

const HomePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['welcome-message'],
    queryFn: fetchWelcomeMessage,
  })

  return (
    <section className="space-y-6 rounded-2xl border border-slate-600/20 bg-slate-900/70 p-8 shadow-soft-xl backdrop-blur">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-50">Welcome to the admin dashboard</h1>
        <p className="text-slate-300">Bootstrap the experience with live data integrations and collaborative tooling.</p>
      </div>
      {isLoading && <p className="text-slate-400">Preparing your workspace…</p>}
      {isError && <p className="text-rose-200">Something went wrong while loading the next steps.</p>}
      {data && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-100">Suggested next steps</h2>
          <ul className="grid list-none gap-3 p-0">
            {data.nextSteps.map((step) => (
              <li
                key={step}
                className="rounded-lg border border-slate-600/40 bg-slate-900/70 px-4 py-3 text-slate-200 shadow-lg shadow-slate-950/40"
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default HomePage
