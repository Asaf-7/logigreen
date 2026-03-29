import {
  Anchor,
  Factory,
  MapPin,
  Package,
  TrainFront,
  Truck,
} from 'lucide-react'
import type { DestinationId, VehicleId } from '../logistics'

export interface RouteVisualizerProps {
  destination: DestinationId
  vehicleId: VehicleId | undefined
  distanceKm: number
}

function CenterVehicleIcon({ vehicleId }: { vehicleId: VehicleId | undefined }) {
  const wrap = 'size-7 sm:size-8'
  if (vehicleId === 'train') {
    return (
      <TrainFront
        className={`${wrap} text-emerald-300`}
        strokeWidth={2}
        aria-hidden
      />
    )
  }
  if (vehicleId === 'ship') {
    return (
      <Anchor
        className={`${wrap} text-cyan-300`}
        strokeWidth={2}
        aria-hidden
      />
    )
  }
  if (vehicleId === 'truck') {
    return (
      <Truck className={`${wrap} text-slate-100`} strokeWidth={2} aria-hidden />
    )
  }
  return (
    <Package
      className={`${wrap} text-slate-500`}
      strokeWidth={2}
      aria-hidden
    />
  )
}

export function RouteVisualizer({
  destination,
  vehicleId,
  distanceKm,
}: RouteVisualizerProps) {
  const vehicleLabel =
    vehicleId === 'train'
      ? 'Elektrikli tren'
      : vehicleId === 'ship'
        ? 'Gemi'
        : vehicleId === 'truck'
          ? 'Kamyon (ağır tır)'
          : 'Hesaplanıyor'

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent p-4 shadow-lg shadow-black/20 backdrop-blur-xl sm:p-5"
      aria-label="Rota özeti: Gebze ila seçilen varış"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(16,185,129,0.06)_0%,transparent_45%,rgba(59,130,246,0.05)_100%)]" />

      <p className="relative mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-xs">
        Rota - Araç
      </p>

      <div className="relative flex items-stretch gap-2 sm:gap-4">
        {/* Sol — Gebze */}
        <div className="flex w-[30%] min-w-0 flex-col items-center gap-2 sm:w-auto sm:max-w-[9rem] sm:items-start">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/35 bg-emerald-500/[0.12] shadow-inner backdrop-blur-md sm:size-12">
            <Factory
              className="size-5 text-emerald-300 sm:size-6"
              strokeWidth={2}
              aria-hidden
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">
              Çıkış
            </p>
            <p className="truncate text-sm font-semibold text-white sm:text-base">
              Gebze
            </p>
            <p className="text-[11px] leading-tight text-slate-400 sm:text-xs">
              Merkez Fabrika
            </p>
          </div>
        </div>

        {/* Orta — kesikli hat + araç */}
        <div className="relative flex min-h-[5.5rem] min-w-0 flex-1 flex-col items-center justify-center px-1">
          <div
            className="absolute left-0 right-0 top-1/2 h-0 -translate-y-1/2 border-t border-dashed border-emerald-400/35 sm:border-t-[0.125rem]"
            aria-hidden
          />
          <div
            className="relative z-10 flex size-14 items-center justify-center rounded-full border border-white/20 bg-slate-950/55 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md ring-1 ring-white/10 sm:size-[4.25rem]"
            title={vehicleLabel}
          >
            <span className="sr-only">Optimum araç: {vehicleLabel}</span>
            <CenterVehicleIcon vehicleId={vehicleId} />
          </div>
          <p className="relative z-10 mt-2 max-w-[10rem] text-center text-[10px] text-slate-500 sm:text-xs">
            {vehicleLabel}
          </p>
        </div>

        {/* Sağ — varış */}
        <div className="flex w-[30%] min-w-0 flex-col items-center gap-2 sm:w-auto sm:max-w-[9rem] sm:items-end">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-teal-400/35 bg-teal-500/[0.12] shadow-inner backdrop-blur-md sm:size-12">
            <MapPin
              className="size-5 text-teal-300 sm:size-6"
              strokeWidth={2}
              aria-hidden
            />
          </div>
          <div className="text-center sm:text-right">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">
              Varış
            </p>
            <p className="truncate text-sm font-semibold text-white sm:text-base">
              {destination}
            </p>
            <p className="text-[11px] text-slate-400 sm:text-xs">{distanceKm} km</p>
          </div>
        </div>
      </div>
    </section>
  )
}
