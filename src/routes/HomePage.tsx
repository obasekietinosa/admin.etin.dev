import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

type TrendDirection = 'up' | 'down' | 'steady'

interface DashboardMetric {
  id: string
  label: string
  value: string
  change: {
    direction: TrendDirection
    value: string
    description: string
  }
}

interface DashboardHighlight {
  id: string
  title: string
  description: string
  category: string
  ctaLabel: string
}

interface DashboardFocusArea {
  id: string
  label: string
  progress: number
  helperText: string
}

interface AnalyticsSummary {
  weeklyVisitors: number
  notesViewed: number
  trend: {
    direction: TrendDirection
    value: string
    description: string
  }
  topSources: Array<{
    id: string
    label: string
    value: string
  }>
  lastUpdated: string
}

interface DashboardOverview {
  metrics: DashboardMetric[]
  highlights: DashboardHighlight[]
  focusAreas: DashboardFocusArea[]
  analytics: AnalyticsSummary
}

const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 320)
  })

  return {
    metrics: [
      {
        id: 'total-notes',
        label: 'Total notes',
        value: '128',
        change: {
          direction: 'up',
          value: '+12% mom',
          description: 'Consistent publishing cadence over the last 30 days.',
        },
      },
      {
        id: 'roles-showcased',
        label: 'Roles showcased',
        value: '7',
        change: {
          direction: 'steady',
          value: 'Stable',
          description: 'Plenty of depth across recent clients and collaborations.',
        },
      },
      {
        id: 'active-tags',
        label: 'Active tags',
        value: '32',
        change: {
          direction: 'up',
          value: '+5 new',
          description: 'New discovery tags added from the latest content batch.',
        },
      },
      {
        id: 'drafts-in-review',
        label: 'Drafts in review',
        value: '4',
        change: {
          direction: 'down',
          value: '-2 this week',
          description: 'Editing queue is clearing out faster than last sprint.',
        },
      },
    ],
    highlights: [
      {
        id: 'note-library',
        title: 'Note library momentum',
        description: '12 new pieces waiting for images. Consider adding gallery support next.',
        category: 'Notes',
        ctaLabel: 'Open notes workspace',
      },
      {
        id: 'role-debriefs',
        title: 'Role debriefs',
        description: 'Two recent consulting engagements are missing testimonials.',
        category: 'Roles',
        ctaLabel: 'Review client feedback',
      },
      {
        id: 'tag-curation',
        title: 'Tag hygiene',
        description: 'Five tags overlap—merge or rename to keep discovery clear.',
        category: 'Taxonomy',
        ctaLabel: 'Audit tags list',
      },
    ],
    focusAreas: [
      {
        id: 'case-studies',
        label: 'Case study refresh',
        progress: 65,
        helperText: 'Update visuals and key metrics for last year’s launches.',
      },
      {
        id: 'newsletter',
        label: 'Newsletter pipeline',
        progress: 40,
        helperText: 'Outline next three issues and align with note backlog.',
      },
      {
        id: 'automation',
        label: 'Automation checklist',
        progress: 85,
        helperText: 'Webhook triggers in place; QA remaining integrations.',
      },
    ],
    analytics: {
      weeklyVisitors: 482,
      notesViewed: 1860,
      trend: {
        direction: 'up',
        value: '+8.4%',
        description: 'Increase compared to the previous 7-day window.',
      },
      topSources: [
        { id: 'source-search', label: 'Organic search', value: '42%' },
        { id: 'source-social', label: 'Social referrals', value: '28%' },
        { id: 'source-email', label: 'Newsletter traffic', value: '19%' },
        { id: 'source-direct', label: 'Direct visits', value: '11%' },
      ],
      lastUpdated: '15 minutes ago',
    },
  }
}

const directionStyles: Record<TrendDirection, string> = {
  up: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/40',
  down: 'bg-rose-500/10 text-rose-200 border-rose-400/40',
  steady: 'bg-slate-500/10 text-slate-200 border-slate-400/30',
}

const HomePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: fetchDashboardOverview,
  })

  const loadingSkeleton = useMemo(
    () => (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl border border-slate-700/40 bg-slate-900/50"
          />
        ))}
      </div>
    ),
    []
  )

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-slate-400">Dashboard</p>
        <h1 className="text-3xl font-semibold text-slate-50">Operational overview</h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Keep a pulse on your portfolio and quickly prioritize the next update cycle. All values are
          mocked for now—wire up live queries as API endpoints come online.
        </p>
      </header>

      {isLoading && (
        <div className="space-y-6 rounded-3xl border border-slate-700/40 bg-slate-900/60 p-6 shadow-soft-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Loading dashboard metrics…</span>
            <span className="text-xs text-slate-500">Fetching preview data</span>
          </div>
          {loadingSkeleton}
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4 text-rose-200">
          There was an issue loading the dashboard preview. Retry or check your network setup.
        </div>
      )}

      {data && (
        <div className="space-y-8">
          <section className="rounded-3xl border border-slate-700/40 bg-slate-900/60 p-6 shadow-soft-xl">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-100">Key metrics</h2>
                <p className="text-sm text-slate-400">Review snapshot figures to spot trends at a glance.</p>
              </div>
              <span className="text-xs text-slate-500">Updated {data.analytics.lastUpdated}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {data.metrics.map((metric) => (
                <article
                  key={metric.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-700/40 bg-slate-950/40 p-5"
                >
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-slate-400">{metric.label}</p>
                    <p className="text-3xl font-semibold text-slate-50">{metric.value}</p>
                  </div>
                  <div
                    className={`mt-4 space-y-1 rounded-xl border px-3 py-2 text-xs ${directionStyles[metric.change.direction]}`}
                  >
                    <p className="font-medium">{metric.change.value}</p>
                    <p className="text-[11px] text-slate-300/80">{metric.change.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-3">
            <section className="rounded-3xl border border-slate-700/40 bg-slate-900/60 p-6 shadow-soft-xl xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-100">Highlights & follow-ups</h2>
                <span className="text-xs text-slate-500">Curated for the upcoming sprint</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {data.highlights.map((highlight) => (
                  <article
                    key={highlight.id}
                    className="flex h-full flex-col justify-between rounded-2xl border border-slate-700/40 bg-slate-950/50 p-5"
                  >
                    <div className="space-y-3">
                      <span className="inline-flex items-center rounded-full border border-slate-500/30 bg-slate-800/70 px-2.5 py-1 text-xs font-medium text-slate-300">
                        {highlight.category}
                      </span>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-slate-100">{highlight.title}</h3>
                        <p className="text-sm text-slate-300">{highlight.description}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center justify-center rounded-xl border border-slate-600/40 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-400/60 hover:text-slate-50"
                    >
                      {highlight.ctaLabel}
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-5 rounded-3xl border border-slate-700/40 bg-slate-900/60 p-6 shadow-soft-xl">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-100">Focus areas</h2>
                <p className="text-sm text-slate-400">Track strategic initiatives and their progress.</p>
              </div>
              <div className="space-y-5">
                {data.focusAreas.map((area) => (
                  <article key={area.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span className="font-medium text-slate-200">{area.label}</span>
                      <span className="text-xs text-slate-400">{area.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
                      <div
                        className="h-full rounded-full bg-sky-500"
                        style={{ width: `${area.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">{area.helperText}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-3xl border border-slate-700/40 bg-slate-900/60 p-6 shadow-soft-xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-slate-100">Audience & engagement</h2>
                <p className="text-sm text-slate-400">Mock analytics data to guide future instrumentation.</p>
              </div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${directionStyles[data.analytics.trend.direction]}`}
              >
                <span>{data.analytics.trend.value}</span>
                <span className="text-slate-300/80">{data.analytics.trend.description}</span>
              </div>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-700/40 bg-slate-950/40 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-400">Weekly visitors</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{data.analytics.weeklyVisitors}</p>
                <p className="mt-1 text-xs text-slate-400">Based on mocked telemetry</p>
              </div>
              <div className="rounded-2xl border border-slate-700/40 bg-slate-950/40 p-5">
                <p className="text-xs uppercase tracking-wide text-slate-400">Notes viewed</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">{data.analytics.notesViewed.toLocaleString()}</p>
                <p className="mt-1 text-xs text-slate-400">Aggregate note detail views for the past 7 days.</p>
              </div>
              <div className="sm:col-span-2 lg:col-span-2">
                <div className="rounded-2xl border border-slate-700/40 bg-slate-950/40 p-5">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Top discovery sources</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    {data.analytics.topSources.map((source) => (
                      <li key={source.id} className="flex items-center justify-between">
                        <span>{source.label}</span>
                        <span className="font-medium text-slate-100">{source.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

export default HomePage
