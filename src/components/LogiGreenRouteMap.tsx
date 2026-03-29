import { useId } from 'react'
import { Anchor, Factory, MapPin, TrainFront, Truck } from 'lucide-react'
import type { DestinationId, VehicleId } from '../logistics'

type CityKey = 'Gebze' | DestinationId

const POINTS: Record<
  CityKey,
  { x: number; y: number; label: string; sub: string }
> = {
  Gebze: { x: 38, y: 27, label: 'Gebze', sub: 'Fabrika (çıkış)' },
  Ankara: { x: 51, y: 36, label: 'Ankara', sub: 'Depo' },
  Manisa: { x: 34, y: 41, label: 'Manisa', sub: 'Ege dağıtım' },
  İzmir: { x: 19, y: 51, label: 'İzmir', sub: 'Müşteri 1' },
  Mersin: { x: 55, y: 71, label: 'Mersin', sub: 'Müşteri 2' },
  Kars: { x: 84, y: 21, label: 'Kars', sub: 'Doğu dağıtım' },
}

/** Pin merkezinden etiket kutusu kaydırması (px) — metin çakışmalarını azaltır */
const LABEL_OFFSET_PX: Record<CityKey, { x: number; y: number }> = {
  Gebze: { x: -8, y: -48 },
  Ankara: { x: 48, y: -36 },
  Manisa: { x: -62, y: 4 },
  İzmir: { x: -56, y: 44 },
  Mersin: { x: 50, y: 30 },
  Kars: { x: 42, y: -38 },
}

/**
 * Genişletilmiş stilize silüet — tüm rota noktaları (İzmir–Kars) fill içinde kalır.
 * İnce Trakya çıkıntısı ayrı küçük kontur.
 */
const TURKEY_PATH =
  'M 5 52 L 6.5 34 L 12 24 L 22 16 L 34 12 L 48 11 L 64 12.5 L 79 16 L 90 22 L 97 34 L 97.5 48 L 94 60 L 86 70 L 74 77 L 58 81 L 42 80.5 L 26 75 L 14 64 L 7 54 Z M 4 32 L 8 27 L 11 32 L 7 36 Z'

const MAP_BASE_FILL_OPACITY = 0.55

function quadPoint(
  p0: { x: number; y: number },
  c: { x: number; y: number },
  p1: { x: number; y: number },
  t: number,
) {
  const u = 1 - t
  return {
    x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
    y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y,
  }
}

function svgSafeId(reactId: string) {
  return `lg-${reactId.replace(/:/g, '')}`
}

interface LogiGreenRouteMapProps {
  destination: DestinationId
  vehicleId: VehicleId | undefined
  distanceKm: number
  /** Yan panel düzeni için daha küçük başlık ve harita alanı */
  compact?: boolean
}

export function LogiGreenRouteMap({
  destination,
  vehicleId,
  distanceKm,
  compact = false,
}: LogiGreenRouteMapProps) {
  const uid = svgSafeId(useId())
  const fillId = `${uid}-map-fill`
  const strokeId = `${uid}-map-stroke`
  const routeGradId = `${uid}-route-grad`
  const dotsId = `${uid}-dots`
  const vignetteId = `${uid}-vignette`

  const gebze = POINTS.Gebze
  const dest = POINTS[destination]
  const midBase = {
    x: (gebze.x + dest.x) / 2,
    y: (gebze.y + dest.y) / 2,
  }
  const ctrl = {
    x: midBase.x + (dest.y - gebze.y) * 0.08,
    y: midBase.y - 14,
  }
  const vehiclePos = quadPoint(gebze, ctrl, dest, 0.52)

  const routeD = `M ${gebze.x} ${gebze.y} Q ${ctrl.x} ${ctrl.y} ${dest.x} ${dest.y}`

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/75 p-px shadow-xl shadow-black/25 ring-1 ring-white/[0.06] backdrop-blur-2xl">
      <div className="relative rounded-[calc(1rem-1px)] border border-white/[0.06] bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent">

        <div
          className={
            compact
              ? 'relative px-3 pb-3 pt-3 sm:px-4'
              : 'relative px-4 pb-4 pt-5 sm:px-6'
          }
        >
          <div
            className={
              compact
                ? 'mb-2 flex flex-wrap items-center justify-between gap-2'
                : 'mb-4 flex flex-wrap items-end justify-between gap-2'
            }
          >
            <div>
              <h2
                className={
                  compact
                    ? 'text-base font-semibold tracking-tight text-white'
                    : 'text-lg font-semibold tracking-tight text-white'
                }
              >
                LogiGreen Rota Haritası
              </h2>
            </div>
            <span
              className={
                compact
                  ? 'shrink-0 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-100/95 sm:text-xs'
                  : 'shrink-0 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-100/95'
              }
            >
              Aktif: Gebze → {destination}
            </span>
          </div>

          <div
            className={
              compact
                ? 'relative mx-auto h-[13rem] w-full overflow-visible rounded-xl border border-white/[0.07] bg-[#060a10] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] sm:h-[14rem]'
                : 'relative mx-auto aspect-[16/10] w-full max-w-3xl overflow-visible rounded-xl border border-white/[0.07] bg-[#060a10] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]'
            }
          >
            <svg
              className="h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              aria-label={`Şema harita: Gebze'den ${destination} iline rota`}
            >
              <defs>
                <pattern
                  id={dotsId}
                  width="3.25"
                  height="3.25"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="0.65"
                    cy="0.65"
                    r="0.32"
                    fill="rgb(148 163 184)"
                    opacity={0.11}
                  />
                </pattern>
                <linearGradient id={fillId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(15 23 42)" stopOpacity={0.98} />
                  <stop offset="48%" stopColor="rgb(30 41 59)" stopOpacity={0.92} />
                  <stop offset="100%" stopColor="rgb(2 6 15)" stopOpacity={0.98} />
                </linearGradient>
                <linearGradient id={strokeId} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(100 116 139)" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="rgb(71 85 105)" stopOpacity="0.28" />
                </linearGradient>
                <linearGradient id={routeGradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(52 211 153)" />
                  <stop offset="100%" stopColor="rgb(45 212 191)" />
                </linearGradient>
                <radialGradient id={vignetteId} cx="50%" cy="45%" r="78%">
                  <stop offset="42%" stopColor="rgb(0 0 0)" stopOpacity="0" />
                  <stop offset="100%" stopColor="rgb(0 0 0)" stopOpacity="0.38" />
                </radialGradient>
              </defs>

              <rect
                x="0"
                y="0"
                width="100"
                height="100"
                fill={`url(#${dotsId})`}
              />
              <rect
                x="2"
                y="11"
                width="96"
                height="79"
                rx="5"
                ry="5"
                fill={`url(#${fillId})`}
                opacity={MAP_BASE_FILL_OPACITY}
              />
              <path
                d={TURKEY_PATH}
                fill={`url(#${fillId})`}
                stroke={`url(#${strokeId})`}
                strokeWidth="0.55"
                opacity={0.88}
              />

              <path
                d={routeD}
                fill="none"
                stroke={`url(#${routeGradId})`}
                strokeWidth="0.72"
                strokeLinecap="round"
                strokeDasharray="1.35 2.1"
                className="route-line-anim"
                opacity={0.95}
              />

              <rect
                x="0"
                y="0"
                width="100"
                height="100"
                fill={`url(#${vignetteId})`}
                pointerEvents="none"
              />

              <circle cx={gebze.x} cy={gebze.y} r="1.28" fill="rgb(52 211 153)" stroke="rgb(15 23 42)" strokeWidth="0.4" />
              <circle cx={dest.x} cy={dest.y} r="1.28" fill="rgb(45 212 191)" stroke="rgb(15 23 42)" strokeWidth="0.4" />

              <text
                x="50"
                y="8"
                textAnchor="middle"
                fill="#94a3b8"
                style={{
                  fontSize: compact ? '3.2px' : '3.6px',
                  letterSpacing: '0.08em',
                }}
              >
                Şema — ölçek coğrafi değildir
              </text>
            </svg>

            <VehicleMarkerOverlay
              x={vehiclePos.x}
              y={vehiclePos.y}
              vehicleId={vehicleId}
              compact={compact}
            />

            <CityMarkers
              compact={compact}
              activeDestination={destination}
            />
          </div>

          <MapFooter
            compact={compact}
            destination={destination}
            distanceKm={distanceKm}
            vehicleId={vehicleId}
          />

          <MapLegend compact={compact} />
        </div>
      </div>
    </section>
  )
}

function MapFooter({
  compact,
  destination,
  distanceKm,
  vehicleId,
}: {
  compact: boolean
  destination: DestinationId
  distanceKm: number
  vehicleId: VehicleId | undefined
}) {
  const vehicleLabel =
    vehicleId === 'train'
      ? 'Elektrikli Tren'
      : vehicleId === 'ship'
        ? 'Gemi'
        : vehicleId === 'truck'
          ? 'Ağır Tır'
          : '—'

  return (
    <div
      className={
        compact
          ? 'mt-2.5 rounded-lg border border-white/10 bg-slate-950/50 px-2.5 py-2 text-[11px] text-slate-300 backdrop-blur-sm sm:text-xs'
          : 'mt-3 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-300 backdrop-blur-sm'
      }
    >
      <span className="font-medium text-white">Özet:</span> Gebze (fabrika) →{' '}
      <strong className="text-teal-200">{destination}</strong>
      <span className="text-slate-500"> · </span>
      yaklaşık <strong className="text-slate-200">{distanceKm} km</strong>
      <span className="text-slate-500"> · </span>
      önerilen araç:{' '}
      <strong className="text-emerald-200/95">{vehicleLabel}</strong>
    </div>
  )
}

function MapLegend({ compact }: { compact: boolean }) {
  const row =
    'mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-slate-500 sm:gap-x-4 sm:text-xs'
  const item = 'inline-flex items-center gap-1.5'
  const dot = 'size-2 shrink-0 rounded-full border border-white/20'

  return (
    <div className={row} aria-hidden>
      <span className={item}>
        <span className={`${dot} bg-emerald-500`} /> Çıkış (fabrika)
      </span>
      <span className={item}>
        <span className={`${dot} bg-teal-500/85`} /> Varış (olası / seçili)
      </span>
      <span className={item}>
        <span
          className={`${dot} border-dashed border-emerald-400/50 bg-transparent`}
          style={{
            boxShadow: 'inset 0 0 0 1px rgb(52 211 153)',
          }}
        />
        Planlanan rota
      </span>
      {!compact && (
        <span className={item}>
          <span className="size-2 shrink-0 rounded-full border border-white/20 bg-slate-700" />
          Simge ortada = önerilen araç
        </span>
      )}
      <span className={`${item} max-sm:w-full`}>
        <span className="size-2 shrink-0 rounded-full border border-slate-500/50 bg-slate-700/80" />
        Diğer varışlar: gri nokta (üzerine gelince isim)
      </span>
    </div>
  )
}

function VehicleMarkerOverlay({
  x,
  y,
  vehicleId,
  compact = false,
}: {
  x: number
  y: number
  vehicleId: VehicleId | undefined
  compact?: boolean
}) {
  const leftPct = `${x}%`
  const topPct = `${y}%`

  const wrap = compact
    ? 'pointer-events-none absolute z-30 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 shadow-lg shadow-black/40 backdrop-blur-md'
    : 'pointer-events-none absolute z-30 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 shadow-lg shadow-black/40 backdrop-blur-md'

  const iconCls = compact ? 'size-5' : 'size-6'

  if (!vehicleId) {
    return (
      <div
        className={`${wrap} border-white/15 bg-slate-900/60`}
        style={{ left: leftPct, top: topPct }}
      />
    )
  }

  if (vehicleId === 'train') {
    return (
      <div
        className={`${wrap} border-emerald-400/55 bg-emerald-500/30 text-emerald-200`}
        style={{ left: leftPct, top: topPct }}
        title="Önerilen: Elektrikli Tren"
      >
        <TrainFront className={iconCls} strokeWidth={2} aria-hidden />
      </div>
    )
  }

  if (vehicleId === 'ship') {
    return (
      <div
        className={`${wrap} border-cyan-500/45 bg-cyan-950/55 text-cyan-100`}
        style={{ left: leftPct, top: topPct }}
        title="Önerilen: Gemi"
      >
        <Anchor className={iconCls} strokeWidth={2} aria-hidden />
      </div>
    )
  }

  return (
    <div
      className={`${wrap} border-slate-500/60 bg-slate-900/95 text-slate-50`}
      style={{ left: leftPct, top: topPct }}
      title="Önerilen: Ağır Tır"
    >
      <Truck className={iconCls} strokeWidth={2} aria-hidden />
    </div>
  )
}

function CityMarkers({
  compact = false,
  activeDestination,
}: {
  compact?: boolean
  activeDestination: DestinationId
}) {
  const cities: CityKey[] = [
    'Gebze',
    'Ankara',
    'Manisa',
    'İzmir',
    'Mersin',
    'Kars',
  ]
  const ringHighlight = compact ? 'size-9' : 'size-11'
  const ringMuted = compact ? 'size-2.5' : 'size-3'
  const iconSz = compact ? 'size-4' : 'size-5'

  return (
    <>
      {cities.map((key) => {
        const p = POINTS[key]
        const isGebze = key === 'Gebze'
        const isDest = !isGebze && key === activeDestination
        const showCard = isGebze || isDest
        const off = LABEL_OFFSET_PX[key]
        const scale = compact ? 0.82 : 1
        const labelTx = off.x * scale
        const labelTy = off.y * scale

        const tip = `${p.label} — ${p.sub}`

        return (
          <div
            key={key}
            className={`absolute z-20 ${
              showCard
                ? 'pointer-events-none'
                : 'pointer-events-auto cursor-default'
            }`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative">
              {showCard ? (
                <>
                  <div
                    className={`flex ${ringHighlight} items-center justify-center rounded-full border-2 shadow-md backdrop-blur-md ${
                      isGebze
                        ? 'border-emerald-400/80 bg-emerald-500/35 text-emerald-100 ring-2 ring-emerald-400/30'
                        : 'border-teal-400/85 bg-teal-950/45 text-teal-50 ring-2 ring-teal-400/35'
                    }`}
                  >
                    {isGebze ? (
                      <Factory className={iconSz} strokeWidth={2} aria-hidden />
                    ) : (
                      <MapPin className={iconSz} strokeWidth={2} aria-hidden />
                    )}
                  </div>
                  <div
                    className={`pointer-events-none absolute z-10 max-w-[9.5rem] rounded-md border bg-slate-950/92 px-2 py-1 shadow-lg backdrop-blur-sm sm:max-w-[11rem] ${
                      compact ? 'text-[10px] leading-snug' : 'text-[11px] leading-snug sm:text-xs'
                    } ${
                      isGebze
                        ? 'border-emerald-500/40 ring-1 ring-emerald-500/15'
                        : 'border-teal-500/40 ring-1 ring-teal-400/25'
                    }`}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${labelTx}px), calc(-50% + ${labelTy}px))`,
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`shrink-0 rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white ${
                          isGebze ? 'bg-emerald-600/90' : 'bg-teal-600/95'
                        }`}
                      >
                        {isGebze ? 'Çıkış' : 'Varış'}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-white">{p.label}</div>
                        <div className="text-slate-400">{p.sub}</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={`flex ${ringMuted} shrink-0 items-center justify-center rounded-full border border-slate-500/60 bg-slate-800/90 opacity-80 shadow-sm`}
                  title={tip}
                  aria-label={tip}
                >
                  <span className="sr-only">{tip}</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}
