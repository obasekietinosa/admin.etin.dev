import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

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
  href: string
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
        href: '/notes',
      },
      {
        id: 'role-debriefs',
        title: 'Role debriefs',
        description: 'Two recent consulting engagements are missing testimonials.',
        category: 'Roles',
        ctaLabel: 'Review client feedback',
        href: '/roles',
      },
      {
        id: 'tag-curation',
        title: 'Tag hygiene',
        description: 'Five tags overlap—merge or rename to keep discovery clear.',
        category: 'Taxonomy',
        ctaLabel: 'Audit tags list',
        href: '/tags',
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
  up: 'border-patina/60 bg-patina-surface text-patina-light',
  down: 'border-coral/50 bg-coral-surface text-coral-light',
  steady: 'border-border bg-surface text-muted',
}

const HomePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: fetchDashboardOverview,
  })

  const loadingSkeleton = useMemo(
    () => (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-sm border border-border bg-surface/60 sm:h-36"
          />
        ))}
      </div>
    ),
    [],
  )

  return (
    <section className="space-y-6 sm:space-y-8">
      <header className="page-header">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-bronze">
              Dashboard
            </p>
            <h1>Operational overview</h1>
            <p className="page-header__subtitle">
              Keep a pulse on your portfolio and quickly prioritize the next update cycle. All values
              are mocked for now—wire up live queries as API endpoints come online.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <Link to="/notes/new" className="button button--primary">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>New note</span>
            </Link>
            <Link to="/projects/new" className="button button--secondary">
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>New project</span>
            </Link>
          </div>
        </div>
      </header>

      {isLoading && (
        <div className="card space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Loading dashboard metrics…
            </span>
            <span className="font-mono text-xs text-muted">Fetching preview data</span>
          </div>
          {loadingSkeleton}
        </div>
      )}

      {isError && (
        <div className="alert alert--error" role="alert">
          There was an issue loading the dashboard preview. Retry or check your network setup.
        </div>
      )}

      {data && (
        <div className="space-y-6 sm:space-y-8">
          <section className="card space-y-5">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="section-title">Key metrics</h2>
                <p className="muted">Review snapshot figures to spot trends at a glance.</p>
              </div>
              <span className="font-mono text-xs text-muted">
                Updated {data.analytics.lastUpdated}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
              {data.metrics.map((metric) => (
                <article
                  key={metric.id}
                  className="flex flex-col justify-between rounded-sm border border-border bg-surface/60 p-3.5 sm:p-5"
                >
                  <div className="space-y-1.5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                      {metric.label}
                    </p>
                    <p className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                      {metric.value}
                    </p>
                  </div>
                  <div
                    className={`mt-3.5 space-y-1 rounded-sm border px-2.5 py-2 text-xs ${directionStyles[metric.change.direction]}`}
                  >
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                      {metric.change.value}
                    </p>
                    <p className="hidden text-[11px] opacity-85 sm:block">
                      {metric.change.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-3">
            <section className="card space-y-4 xl:col-span-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="section-title">Highlights & follow-ups</h2>
                <span className="font-mono text-xs text-muted">
                  Curated for the upcoming sprint
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {data.highlights.map((highlight) => (
                  <article
                    key={highlight.id}
                    className="flex h-full flex-col justify-between rounded-sm border border-border bg-surface/60 p-4 sm:p-5"
                  >
                    <div className="space-y-3">
                      <span className="badge badge--patina">{highlight.category}</span>
                      <div className="space-y-1.5">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {highlight.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={highlight.href}
                      className="button button--secondary mt-4 w-full"
                    >
                      {highlight.ctaLabel}
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="card flex flex-col gap-5">
              <div className="space-y-1">
                <h2 className="section-title">Focus areas</h2>
                <p className="muted">Track strategic initiatives and their progress.</p>
              </div>
              <div className="space-y-5">
                {data.focusAreas.map((area) => (
                  <article key={area.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{area.label}</span>
                      <span className="font-mono text-xs text-bronze-light">
                        {area.progress}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-sm border border-border-inner bg-[#0E0C0A]">
                      <div
                        className="h-full bg-gradient-to-r from-bronze-dark via-bronze to-bronze-light"
                        style={{ width: `${area.progress}%` }}
                      />
                    </div>
                    <p className="text-xs leading-relaxed text-muted">{area.helperText}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <section className="card space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h2 className="section-title">Audience & engagement</h2>
                <p className="muted">Mock analytics data to guide future instrumentation.</p>
              </div>
              <div
                className={`inline-flex flex-wrap items-center gap-2 self-start rounded-sm border px-3 py-1.5 text-xs sm:self-auto ${directionStyles[data.analytics.trend.direction]}`}
              >
                <span className="font-mono font-semibold">{data.analytics.trend.value}</span>
                <span className="opacity-85">{data.analytics.trend.description}</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-sm border border-border bg-surface/60 p-4 sm:p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  Weekly visitors
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-foreground">
                  {data.analytics.weeklyVisitors}
                </p>
                <p className="mt-1 text-xs text-muted">Based on mocked telemetry</p>
              </div>
              <div className="rounded-sm border border-border bg-surface/60 p-4 sm:p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  Notes viewed
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-foreground">
                  {data.analytics.notesViewed.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Aggregate note detail views for the past 7 days.
                </p>
              </div>
              <div className="sm:col-span-2 lg:col-span-2">
                <div className="rounded-sm border border-border bg-surface/60 p-4 sm:p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Top discovery sources
                  </p>
                  <ul className="mt-3.5 space-y-2.5 text-sm text-muted">
                    {data.analytics.topSources.map((source) => (
                      <li
                        key={source.id}
                        className="flex items-center justify-between border-b border-border-inner pb-2 last:border-0 last:pb-0"
                      >
                        <span>{source.label}</span>
                        <span className="font-mono text-xs font-semibold text-bronze-light">
                          {source.value}
                        </span>
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
