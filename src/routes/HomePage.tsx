import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { fetchAnalyticsOverview, type TrendDirection } from '../api/analytics'
import { fetchNotes } from '../api/notes'
import { fetchRoles } from '../api/roles'
import { fetchProjects } from '../api/projects'
import { fetchTags } from '../api/tags'

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

const directionStyles: Record<TrendDirection, string> = {
  up: 'border-patina/60 bg-patina-surface text-patina-light',
  down: 'border-coral/50 bg-coral-surface text-coral-light',
  steady: 'border-border bg-surface text-muted',
}

const formatDuration = (seconds: number): string => {
  const rounded = Math.max(0, Math.round(seconds))
  if (rounded < 60) {
    return `${rounded}s`
  }
  const mins = Math.floor(rounded / 60)
  const rem = rounded % 60
  return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`
}

const formatRelativeTime = (isoTimestamp: string): string => {
  const parsed = Date.parse(isoTimestamp)
  if (Number.isNaN(parsed)) {
    return 'just now'
  }
  const diffSec = Math.max(0, Math.floor((Date.now() - parsed) / 1000))
  if (diffSec < 60) return 'just now'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  return new Date(parsed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const PERIOD_OPTIONS = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
] as const

const HomePage = () => {
  const [periodDays, setPeriodDays] = useState<number>(30)

  const analyticsQuery = useQuery({
    queryKey: ['analytics-overview', periodDays],
    queryFn: () => fetchAnalyticsOverview(periodDays),
  })

  const notesQuery = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  })

  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  })

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  const tagsQuery = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  })

  const portfolioMetrics = useMemo<DashboardMetric[]>(() => {
    const notes = notesQuery.data ?? []
    const publishedNotes = notes.filter((n) => Boolean(n.publishedAt)).length
    const draftNotes = notes.length - publishedNotes
    const rolesCount = rolesQuery.data?.length ?? 0
    const projectsCount = projectsQuery.data?.length ?? 0
    const tagsCount = tagsQuery.data?.length ?? 0

    return [
      {
        id: 'total-notes',
        label: 'Published notes',
        value: notesQuery.isLoading ? '—' : String(publishedNotes),
        change: {
          direction: publishedNotes > 0 ? 'up' : 'steady',
          value: `${notes.length} total`,
          description: `${draftNotes} unpublished draft${draftNotes === 1 ? '' : 's'} in workspace.`,
        },
      },
      {
        id: 'roles-showcased',
        label: 'Roles showcased',
        value: rolesQuery.isLoading ? '—' : String(rolesCount),
        change: {
          direction: 'steady',
          value: 'Career timeline',
          description: 'Active and historical engineering leadership roles.',
        },
      },
      {
        id: 'projects-catalog',
        label: 'Projects cataloged',
        value: projectsQuery.isLoading ? '—' : String(projectsCount),
        change: {
          direction: projectsCount > 0 ? 'up' : 'steady',
          value: 'Portfolio',
          description: 'Featured case studies and engineering builds.',
        },
      },
      {
        id: 'active-tags',
        label: 'Active tags',
        value: tagsQuery.isLoading ? '—' : String(tagsCount),
        change: {
          direction: 'steady',
          value: 'Taxonomy',
          description: 'Cross-cutting topics linking notes, roles, and projects.',
        },
      },
    ]
  }, [
    notesQuery.data,
    notesQuery.isLoading,
    rolesQuery.data,
    rolesQuery.isLoading,
    projectsQuery.data,
    projectsQuery.isLoading,
    tagsQuery.data,
    tagsQuery.isLoading,
  ])

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

  const analytics = analyticsQuery.data

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
              Live portfolio inventory from api.etin.dev paired with privacy-first reader telemetry
              from analytics.etin.dev.
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

      <div className="space-y-6 sm:space-y-8">
        <section className="card space-y-5">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-title">Portfolio inventory</h2>
              <p className="muted">Live record counts synced from api.etin.dev.</p>
            </div>
            <span className="font-mono text-xs text-muted">
              {analytics ? `Updated ${formatRelativeTime(analytics.lastUpdated)}` : 'Syncing…'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {portfolioMetrics.map((metric) => (
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

        <section className="card space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="section-title">Audience & reading engagement</h2>
              <p className="muted">
                GDPR-compliant, cookieless telemetry from analytics.etin.dev over the last{' '}
                {periodDays} days.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {analytics && (
                <div
                  className={`inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs ${directionStyles[analytics.trend.direction]}`}
                >
                  <span className="font-mono font-semibold">{analytics.trend.value}</span>
                  <span className="hidden opacity-85 sm:inline">{analytics.trend.description}</span>
                </div>
              )}
              <div
                className="inline-flex rounded-sm border border-border bg-surface p-0.5"
                role="group"
                aria-label="Analytics time period"
              >
                {PERIOD_OPTIONS.map((option) => {
                  const active = periodDays === option.days
                  return (
                    <button
                      key={option.days}
                      type="button"
                      onClick={() => setPeriodDays(option.days)}
                      className={`rounded-sm px-2.5 py-1 font-mono text-xs transition-colors ${
                        active
                          ? 'bg-bronze text-[#12100E] font-semibold'
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {analyticsQuery.isLoading && loadingSkeleton}

          {analyticsQuery.isError && (
            <div className="alert alert--error" role="alert">
              Could not reach analytics.etin.dev. Verify the service is online and CORS is enabled.
            </div>
          )}

          {analytics && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <div className="rounded-sm border border-border bg-surface/60 p-4 sm:p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Pageviews ({periodDays}d)
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
                    {analytics.pageviews.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted">Total page loads across etin.dev</p>
                </div>

                <div className="rounded-sm border border-border bg-surface/60 p-4 sm:p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Unique visitors
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
                    {analytics.uniqueVisitors.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {analytics.returningVisitors > 0
                      ? `${analytics.returningVisitors.toLocaleString()} returning (opted-in)`
                      : 'Daily rotating salted hash'}
                  </p>
                </div>

                <div className="rounded-sm border border-border bg-surface/60 p-4 sm:p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Notes viewed
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
                    {analytics.notesViewed.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted">Reads on /notes/* articles</p>
                </div>

                <div className="rounded-sm border border-border bg-surface/60 p-4 sm:p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    Reading engagement
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-foreground sm:text-3xl">
                    {formatDuration(analytics.avgDurationSeconds)}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Avg {Math.round(analytics.avgScrollDepth)}% scroll depth
                  </p>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-sm border border-border bg-surface/60 p-4 sm:p-5 xl:col-span-2">
                  <div className="flex items-center justify-between border-b border-border-inner pb-3">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-bronze">
                        Content performance
                      </p>
                      <h3 className="mt-0.5 font-display text-base font-semibold text-foreground">
                        Top pages & reading depth
                      </h3>
                    </div>
                    <span className="font-mono text-xs text-muted">
                      Active time & scroll milestone
                    </span>
                  </div>

                  {analytics.topPages.length === 0 ? (
                    <p className="py-6 text-sm text-muted">
                      No pageviews recorded in this window yet. Visit etin.dev to generate the first
                      beacon.
                    </p>
                  ) : (
                    <div className="mt-3 divide-y divide-border-inner">
                      {analytics.topPages.map((page) => (
                        <div
                          key={page.path}
                          className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-mono text-xs font-medium text-foreground">
                              {page.path}
                            </p>
                            <p className="text-xs text-muted">
                              {page.views.toLocaleString()} views ·{' '}
                              {page.uniqueVisitors.toLocaleString()} unique
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="font-mono text-xs font-semibold text-bronze-light">
                                {formatDuration(page.avgDurationSeconds)}
                              </span>
                              <span className="ml-2 font-mono text-xs text-muted">
                                {Math.round(page.avgScrollDepth)}% scroll
                              </span>
                            </div>
                            <div className="hidden h-1.5 w-20 overflow-hidden rounded-sm border border-border-inner bg-[#0E0C0A] sm:block">
                              <div
                                className="h-full bg-gradient-to-r from-bronze-dark via-bronze to-bronze-light"
                                style={{
                                  width: `${Math.min(100, Math.max(0, Math.round(page.avgScrollDepth)))}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="rounded-sm border border-border bg-surface/60 p-4 sm:p-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                      Top discovery sources
                    </p>
                    {analytics.topSources.length === 0 ? (
                      <p className="mt-3 text-xs text-muted">No referrer data recorded yet.</p>
                    ) : (
                      <ul className="mt-3.5 space-y-2.5 text-sm text-muted">
                        {analytics.topSources.map((source) => (
                          <li
                            key={source.label}
                            className="flex items-center justify-between border-b border-border-inner pb-2 last:border-0 last:pb-0"
                          >
                            <span className="truncate pr-2 text-foreground">{source.label}</span>
                            <span className="font-mono text-xs font-semibold text-bronze-light">
                              {source.share} ({source.count})
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="rounded-sm border border-border bg-surface/60 p-4 sm:p-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                      Devices & outbound clicks
                    </p>
                    {analytics.devices.length === 0 ? (
                      <p className="mt-3 text-xs text-muted">No device breakdown yet.</p>
                    ) : (
                      <ul className="mt-3 space-y-2 text-xs text-muted">
                        {analytics.devices.map((dev) => (
                          <li key={dev.label} className="flex items-center justify-between">
                            <span className="capitalize text-foreground">{dev.label}</span>
                            <span className="font-mono text-bronze-light">{dev.share}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {analytics.outboundClicks.length > 0 && (
                      <div className="mt-4 border-t border-border-inner pt-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                          Top outbound links
                        </p>
                        <ul className="mt-2 space-y-1.5 text-xs">
                          {analytics.outboundClicks.slice(0, 3).map((item) => (
                            <li
                              key={item.targetUrl}
                              className="flex items-center justify-between gap-2"
                            >
                              <span className="truncate font-mono text-muted">
                                {item.targetUrl}
                              </span>
                              <span className="shrink-0 font-mono text-bronze-light">
                                {item.clicks}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

export default HomePage
