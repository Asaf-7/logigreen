import { type ReactNode, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Anchor,
  Cloud,
  Coins,
  Factory,
  Leaf,
  MapPin,
  Sparkles,
  TrainFront,
  Truck,
} from 'lucide-react'
import {
  type DestinationId,
  type OptimizationGoal,
  DISTANCES_KM,
  ORIGIN_LABEL,
  getOptionsForDestination,
  pickOptimum,
} from './logistics'
import { LogiGreenRouteMap } from './components/LogiGreenRouteMap'
import { RouteVisualizer } from './components/RouteVisualizer'

const DESTINATIONS: DestinationId[] = [
  'Ankara',
  'İzmir',
  'Kars',
  'Manisa',
  'Mersin',
]

function formatTl(n: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(n)
}

function formatTon(n: number) {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(n)
}

export default function App() {
  const [destination, setDestination] = useState<DestinationId>('Kars')
  const [loadTon, setLoadTon] = useState<string>('20')
  const [carbonTax, setCarbonTax] = useState<string>('500')
  const [goal, setGoal] = useState<OptimizationGoal>('cost')

  const loadNum = Number.parseFloat(loadTon.replace(',', '.')) || 0
  const taxNum = Number.parseFloat(carbonTax.replace(',', '.')) || 0

  const options = useMemo(
    () => getOptionsForDestination(destination, loadNum, taxNum),
    [destination, loadNum, taxNum],
  )

  const optimum = useMemo(
    () => pickOptimum(options, goal),
    [options, goal],
  )

  const chartData = useMemo(
    () =>
      options.map((o) => ({
        name: o.vehicle.name,
        'Toplam Maliyet (TL)': Math.round(o.totalCostTl),
        'Toplam Emisyon (ton CO₂)': Number(o.totalEmissionTon.toFixed(6)),
      })),
    [options],
  )

  const distance = DISTANCES_KM[destination]

  return (
    <div className="min-h-svh bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12),_transparent_50%),radial-gradient(ellipse_at_bottom,_rgba(16,185,129,0.08),_transparent_55%)]" />

      <div className="relative mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            <span className="text-white">Logi</span>
            <span className="text-emerald-400">Green</span>
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-base text-slate-400 sm:text-lg">
            Yeşil lojistik ve rota optimizasyon sistemi
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
          {/* Sol panel */}
          <aside className="h-fit rounded-2xl border border-white/15 bg-white/5 p-6 shadow-2xl shadow-blue-900/20 backdrop-blur-xl">
            <h2 className="flex items-center gap-2 text-lg font-medium text-white">
              <MapPin className="size-5 text-blue-400" />
              Parametreler
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Değerleri değiştirdiğinizde hesaplama anında güncellenir.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
                  Çıkış noktası
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 text-slate-200">
                  <Factory className="size-5 shrink-0 text-emerald-400" />
                  <span className="font-medium">{ORIGIN_LABEL}</span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="destination"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  Varış noktası
                </label>
                <select
                  id="destination"
                  value={destination}
                  onChange={(e) =>
                    setDestination(e.target.value as DestinationId)
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white outline-none ring-blue-500/50 transition focus:ring-2"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d} value={d} className="bg-slate-900">
                      {d} ({DISTANCES_KM[d]} km)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="load"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  Taşınacak yük (ton)
                </label>
                <input
                  id="load"
                  type="number"
                  min={0}
                  step={0.1}
                  value={loadTon}
                  onChange={(e) => setLoadTon(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white outline-none ring-blue-500/50 transition placeholder:text-slate-500 focus:ring-2"
                  placeholder="Örn: 20"
                />
              </div>

              <div>
                <label
                  htmlFor="tax"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400"
                >
                  Karbon vergisi (TL / ton CO₂)
                </label>
                <input
                  id="tax"
                  type="number"
                  min={0}
                  step={1}
                  value={carbonTax}
                  onChange={(e) => setCarbonTax(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-white outline-none ring-blue-500/50 transition focus:ring-2"
                  placeholder="Örn: 500"
                />
              </div>

              <fieldset>
                <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Optimizasyon hedefi
                </legend>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-slate-900/30 px-4 py-3 has-[:checked]:border-blue-500/50 has-[:checked]:bg-blue-600/15">
                    <input
                      type="radio"
                      name="goal"
                      checked={goal === 'cost'}
                      onChange={() => setGoal('cost')}
                      className="accent-blue-500"
                    />
                    <span className="text-sm">En düşük maliyet</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-slate-900/30 px-4 py-3 has-[:checked]:border-emerald-500/50 has-[:checked]:bg-emerald-600/15">
                    <input
                      type="radio"
                      name="goal"
                      checked={goal === 'emission'}
                      onChange={() => setGoal('emission')}
                      className="accent-emerald-500"
                    />
                    <span className="text-sm">En düşük emisyon</span>
                  </label>
                </div>
              </fieldset>
            </div>
          </aside>

          {/* Sağ panel */}
          <main className="space-y-8">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] lg:items-stretch xl:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
              <div className="flex min-w-0 flex-col gap-4 self-start lg:max-w-none">
                <LogiGreenRouteMap
                  compact
                  destination={destination}
                  vehicleId={optimum?.vehicle.id}
                  distanceKm={distance}
                />
                {optimum && (
                  <section className="grid w-full min-w-0 max-w-full grid-cols-2 gap-2.5 self-start">
                    <MetricCard
                      icon={<Leaf className="size-4 text-emerald-400" />}
                      title="Toplam karbon ayak izi"
                      value={`${formatTon(optimum.totalEmissionTon)} ton CO₂`}
                      hint="Mesafe × yük × araç emisyonu"
                    />
                    <MetricCard
                      icon={<Coins className="size-4 text-blue-400" />}
                      title="Saf lojistik maliyeti"
                      value={formatTl(optimum.logisticsCostTl)}
                      hint="Mesafe × araç birim maliyeti"
                    />
                    <div className="col-span-2 min-w-0">
                      <MetricCard
                        icon={<Cloud className="size-4 text-sky-300" />}
                        title="Ödenmesi gereken karbon vergisi"
                        value={formatTl(optimum.carbonTaxTl)}
                        hint="Emisyon × vergi oranı"
                      />
                    </div>
                  </section>
                )}
              </div>

              <div className="flex min-w-0 flex-col gap-5">
                {optimum && (
                  <section className="overflow-hidden rounded-2xl border border-emerald-400/25 bg-gradient-to-br from-emerald-500/15 via-blue-600/10 to-slate-900/60 p-0.5 shadow-xl shadow-emerald-900/20 backdrop-blur-xl">
                    <div className="rounded-[0.85rem] border border-white/10 bg-white/5 p-4 sm:p-5">
                      <p className="flex items-center gap-2 text-xs font-medium text-emerald-300">
                        <Sparkles className="size-3.5 shrink-0" />
                        Optimum rota özeti
                      </p>
                      <h2 className="mt-2 text-balance break-words text-base font-bold leading-snug tracking-tight text-white sm:text-lg lg:text-xl">
                        Önerilen Rota: Gebze → {destination} | Araç:{' '}
                        {optimum.vehicle.name}
                      </h2>
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3 text-slate-300">
                        <VehicleIcon vehicleId={optimum.vehicle.id} small />
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs">
                          {distance} km
                        </span>
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs">
                          {loadNum > 0 ? `${formatTon(loadNum)} ton` : '— ton'}
                        </span>
                        <span className="rounded-full border border-blue-500/30 bg-blue-600/20 px-2 py-0.5 text-xs text-blue-100">
                          Hedef:{' '}
                          {goal === 'cost'
                            ? 'En düşük maliyet'
                            : 'En düşük emisyon'}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                          <p className="text-[10px] text-slate-400">
                            Toplam maliyet
                          </p>
                          <p className="text-sm font-semibold text-white sm:text-base">
                            {formatTl(optimum.totalCostTl)}
                          </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                          <p className="text-[10px] text-slate-400">
                            Toplam emisyon
                          </p>
                          <p className="text-sm font-semibold text-emerald-200 sm:text-base">
                            {formatTon(optimum.totalEmissionTon)} ton CO₂
                          </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                          <p className="text-[10px] text-slate-400">
                            Saf lojistik
                          </p>
                          <p className="text-sm font-semibold text-blue-200 sm:text-base">
                            {formatTl(optimum.logisticsCostTl)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                <section className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-xl backdrop-blur-xl">
                  <h2 className="mb-0.5 text-base font-medium text-white">
                    Araç bazlı karşılaştırma
                  </h2>
                  <p className="mb-3 text-xs text-slate-400">
                    Toplam maliyet (sol, TL) ve emisyon (sağ, ton CO₂).
                  </p>
                  <div className="h-[240px] w-full min-w-0 sm:h-[260px]">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                      minHeight={200}
                      debounce={50}
                    >
                      <BarChart
                        data={chartData}
                        margin={{ top: 12, right: 14, left: 20, bottom: 8 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(148,163,184,0.15)"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: '#94a3b8', fontSize: 10 }}
                          axisLine={{ stroke: 'rgba(148,163,184,0.3)' }}
                        />
                        <YAxis
                          yAxisId="left"
                          tick={{ fill: '#cbd5f5', fontSize: 11, fontWeight: 500 }}
                          width={52}
                          axisLine={{ stroke: 'rgba(96,165,250,0.45)' }}
                          label={{
                            value: 'TL',
                            angle: -90,
                            position: 'left',
                            offset: 4,
                            fill: '#e0e7ff',
                            fontSize: 13,
                            fontWeight: 700,
                            style: { textAnchor: 'middle' },
                          }}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tick={{ fill: '#a7f3d0', fontSize: 11, fontWeight: 500 }}
                          width={44}
                          axisLine={{ stroke: 'rgba(52,211,153,0.45)' }}
                          label={{
                            value: 'ton',
                            angle: 90,
                            position: 'insideRight',
                            offset: 8,
                            fill: '#a7f3d0',
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15,23,42,0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '12px',
                          }}
                          labelStyle={{ color: '#e2e8f0' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px', color: '#cbd5e1' }} />
                        <Bar
                          yAxisId="left"
                          dataKey="Toplam Maliyet (TL)"
                          fill="#2563eb"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={32}
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="Toplam Emisyon (ton CO₂)"
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={32}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
              {destination !== 'İzmir' && destination !== 'Mersin' && (
                <p className="mt-2 text-[10px] text-slate-500 sm:text-xs">
                  Gemi yalnızca İzmir ve Mersin liman senaryosu için geçerlidir;
                  bu varışta grafikte tır ve tren karşılaştırılır.
                </p>
              )}
                </section>
              </div>
            </div>

            <RouteVisualizer
              destination={destination}
              vehicleId={optimum?.vehicle.id}
              distanceKm={distance}
            />
          </main>
        </div>

        <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          LogiGreen — karayolu mesafeleri Gebze çıkış referanslıdır (tipik güzergâh,
          km yaklaşık): Ankara 418, Manisa 407, İzmir 508, Mersin 902, Kars 1398.
        </footer>
      </div>
    </div>
  )
}

function VehicleIcon({
  vehicleId,
  small,
}: {
  vehicleId: string
  small?: boolean
}) {
  const sz = small ? 'size-6' : 'size-8'
  if (vehicleId === 'train') {
    return (
      <TrainFront className={`${sz} shrink-0 text-emerald-400`} aria-hidden />
    )
  }
  if (vehicleId === 'ship') {
    return <Anchor className={`${sz} shrink-0 text-blue-400`} aria-hidden />
  }
  return <Truck className={`${sz} shrink-0 text-slate-200`} aria-hidden />
}

function MetricCard({
  icon,
  title,
  value,
  hint,
}: {
  icon: ReactNode
  title: string
  value: string
  hint: string
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/12 bg-white/[0.06] px-2.5 py-2.5 shadow-md backdrop-blur-xl">
      <div className="flex items-start gap-1.5 text-slate-400">
        {icon}
        <span className="text-[11px] font-medium leading-snug">{title}</span>
      </div>
      <p className="mt-1.5 text-sm font-semibold leading-tight tracking-tight text-white sm:text-base">
        {value}
      </p>
      <p className="mt-1.5 text-[10px] leading-snug text-slate-500 sm:text-xs">
        {hint}
      </p>
    </div>
  )
}
