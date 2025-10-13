import { useQuery } from '@tanstack/react-query'
import {
  buttonVariants,
  errorAlertClassName,
  mutedTextClassName,
  panelClassName,
  sectionHeadingClassName,
  sectionSubheadingClassName,
} from './ui'

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

const quickStats = [
  {
    label: 'API integrations',
    value: 'In progress',
    description: 'Wire up REST hooks for companies and roles.',
  },
  {
    label: 'Content freshness',
    value: 'Needs sync',
    description: 'Publish the latest experiences from etin.dev.',
  },
  {
    label: 'Team collaboration',
    value: 'Not enabled',
    description: 'Invite teammates once authentication is live.',
  },
]

const HomePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['welcome-message'],
    queryFn: fetchWelcomeMessage,
  })

  return (
    <section className="space-y-8">
      <header className={`${panelClassName} relative overflow-hidden`}> 
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/20 via-violet-500/10 to-transparent" />
        <div className="relative space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-400">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold text-white">Welcome to the admin workspace</h1>
          <p className={sectionSubheadingClassName}>
            Monitor progress, review upcoming tasks, and prepare integrations for the public etin.dev experience.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://api.etin.dev/swagger"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants.primary}
            >
              View API reference
            </a>
            <a
              href="https://github.com/obaskietinosa/api.etin.dev"
              target="_blank"
              rel="noreferrer"
              className={buttonVariants.ghost}
            >
              Visit backend repo
            </a>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,3fr]">
        <div className="space-y-6">
          <div className={`${panelClassName} space-y-4`}>
            <h2 className={sectionHeadingClassName}>Workspace status</h2>
            <p className={sectionSubheadingClassName}>
              {data?.message ?? 'Stay tuned while we load the latest context for your projects.'}
            </p>
            {isLoading && (
              <div className="space-y-3">
                <div className="h-3 w-3/4 animate-pulse rounded-full bg-white/10" />
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-white/10" />
                <div className="h-3 w-1/2 animate-pulse rounded-full bg-white/10" />
              </div>
            )}
            {isError && (
              <div className={errorAlertClassName} role="alert">
                <p className="font-semibold">Something went wrong while loading the next steps.</p>
                <p>Please refresh the page or try again shortly.</p>
              </div>
            )}
            {data && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Suggested next steps
                </h3>
                <ul className="space-y-3">
                  {data.nextSteps.map((step) => (
                    <li
                      key={step}
                      className="rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-200 shadow-inner shadow-slate-950/40"
                    >
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={`${panelClassName} space-y-4`}>
            <h2 className={sectionHeadingClassName}>Quick strategy checklist</h2>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                Finalize authentication flows so collaborators can share drafts safely.
              </li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                Define shared data fetching hooks for companies and roles to keep requests consistent.
              </li>
              <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                Draft UI snapshots for upcoming sections to maintain design parity with etin.dev.
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`${panelClassName} space-y-4`}>
            <h2 className={sectionHeadingClassName}>Readiness overview</h2>
            <div className="grid gap-3">
              {quickStats.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="text-lg font-semibold text-white">{item.value}</p>
                  <p className={mutedTextClassName}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`${panelClassName} space-y-4`}>
            <h2 className={sectionHeadingClassName}>Release coordination</h2>
            <div className="space-y-3 text-sm text-slate-200">
              <p>
                Align the admin roadmap with the public site launch. Track environment variables, deployment triggers, and
                testing coverage before unlocking write access for collaborators.
              </p>
              <p className={mutedTextClassName}>
                Tip: document manual steps alongside automated checks so future releases stay predictable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomePage
