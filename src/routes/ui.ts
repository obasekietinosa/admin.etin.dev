export const panelClassName =
  'rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-soft-xl backdrop-blur sm:p-8'

export const sectionHeadingClassName = 'text-2xl font-semibold text-slate-50'
export const sectionSubheadingClassName = 'text-sm text-slate-300'
export const mutedTextClassName = 'text-sm text-slate-400'

export const buttonVariants = {
  primary:
    'inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-400 hover:to-violet-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-70',
  secondary:
    'inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-70',
  ghost:
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60',
  danger:
    'inline-flex items-center justify-center rounded-xl border border-rose-500/50 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:cursor-not-allowed disabled:opacity-60',
} as const

export const errorAlertClassName =
  'rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 shadow-inner shadow-rose-900/30'

export const infoAlertClassName =
  'rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-100 shadow-inner shadow-blue-900/20'

export const formLabelClassName = 'block text-sm font-medium text-slate-200'
export const formInputClassName =
  'mt-1 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50'
export const formTextareaClassName =
  'mt-1 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50'
export const formHelperClassName = 'mt-2 text-xs text-slate-400'

export const tableWrapperClassName =
  'overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-soft-xl backdrop-blur'
export const tableClassName = 'w-full border-collapse text-left text-sm text-slate-200'
export const tableHeadCellClassName = 'px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300'
export const tableBodyRowClassName = 'border-t border-white/5 bg-slate-900/40 transition hover:bg-slate-900/60'
export const tableBodyCellClassName = 'px-4 py-4 align-top text-sm text-slate-100'
export const emptyStateClassName =
  'flex flex-col items-start gap-3 rounded-3xl border border-dashed border-white/20 bg-slate-900/40 p-8 text-slate-200 shadow-soft-xl backdrop-blur'
