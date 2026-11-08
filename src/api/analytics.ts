import { getAccessToken } from '../auth/session'

const ANALYTICS_BASE_URL =
  import.meta.env.VITE_ANALYTICS_BASE_URL ?? 'https://analytics.etin.dev/v1'

export type TrendDirection = 'up' | 'down' | 'steady'

export interface TrendSummary {
  direction: TrendDirection
  value: string
  description: string
}

export interface MetricBreakdown {
  label: string
  count: number
  share: string
}

export interface PagePerformance {
  path: string
  views: number
  uniqueVisitors: number
  avgDurationSeconds: number
  avgScrollDepth: number
}

export interface OutboundClickStat {
  targetUrl: string
  clicks: number
}

export interface DailyPoint {
  day: string
  views: number
  visitors: number
}

export interface AnalyticsOverview {
  siteId: string
  periodDays: number
  pageviews: number
  uniqueVisitors: number
  returningVisitors: number
  notesViewed: number
  avgDurationSeconds: number
  avgScrollDepth: number
  trend: TrendSummary
  dailySeries: DailyPoint[]
  topPages: PagePerformance[]
  topSources: MetricBreakdown[]
  devices: MetricBreakdown[]
  browsers: MetricBreakdown[]
  outboundClicks: OutboundClickStat[]
  lastUpdated: string
}

interface PublicAnalyticsStats {
  siteId: string
  path?: string
  totalViews?: number
  views?: number
  uniqueVisitors: number
  avgDurationSeconds: number
  avgScrollDepth: number
}

export const fetchAnalyticsOverview = async (days = 30): Promise<AnalyticsOverview> => {
  const headers = new Headers({
    Accept: 'application/json',
  })

  const token = getAccessToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${ANALYTICS_BASE_URL}/stats/overview?days=${days}`, {
    headers,
  })

  if (response.ok) {
    const raw = (await response.json()) as Partial<AnalyticsOverview>
    const direction: TrendDirection =
      raw.trend?.direction === 'up' || raw.trend?.direction === 'down'
        ? raw.trend.direction
        : 'steady'

    return {
      siteId: raw.siteId ?? 'etin.dev',
      periodDays: raw.periodDays ?? days,
      pageviews: raw.pageviews ?? 0,
      uniqueVisitors: raw.uniqueVisitors ?? 0,
      returningVisitors: raw.returningVisitors ?? 0,
      notesViewed: raw.notesViewed ?? 0,
      avgDurationSeconds: raw.avgDurationSeconds ?? 0,
      avgScrollDepth: raw.avgScrollDepth ?? 0,
      trend: {
        direction,
        value: raw.trend?.value ?? '0.0%',
        description: raw.trend?.description ?? `Compared to previous ${days}-day window`,
      },
      dailySeries: raw.dailySeries ?? [],
      topPages: raw.topPages ?? [],
      topSources: raw.topSources ?? [],
      devices: raw.devices ?? [],
      browsers: raw.browsers ?? [],
      outboundClicks: raw.outboundClicks ?? [],
      lastUpdated: raw.lastUpdated ?? new Date().toISOString(),
    }
  }

  // Graceful fallback to public aggregate endpoint if admin SSO verification is still rolling out
  const publicRes = await fetch(`${ANALYTICS_BASE_URL}/public/stats`, {
    headers: { Accept: 'application/json' },
  })

  if (!publicRes.ok) {
    throw new Error(`Analytics request failed with status ${response.status}`)
  }

  const pub = (await publicRes.json()) as PublicAnalyticsStats
  const views = pub.views ?? pub.totalViews ?? 0

  return {
    siteId: pub.siteId ?? 'etin.dev',
    periodDays: days,
    pageviews: views,
    uniqueVisitors: pub.uniqueVisitors ?? 0,
    returningVisitors: 0,
    notesViewed: 0,
    avgDurationSeconds: pub.avgDurationSeconds ?? 0,
    avgScrollDepth: pub.avgScrollDepth ?? 0,
    trend: {
      direction: 'steady',
      value: 'Live',
      description: 'Connected to public aggregate stats endpoint.',
    },
    dailySeries: [],
    topPages: [],
    topSources: [],
    devices: [],
    browsers: [],
    outboundClicks: [],
    lastUpdated: new Date().toISOString(),
  }
}
