export type DestinationId =
  | 'Ankara'
  | 'İzmir'
  | 'Manisa'
  | 'Mersin'
  | 'Kars'
export type VehicleId = 'truck' | 'train' | 'ship'
export type OptimizationGoal = 'cost' | 'emission'

export interface VehicleDef {
  id: VehicleId
  name: string
  costPerKm: number
  emissionGPerTonKm: number
  /** Gemi yalnızca belirli limanlar için */
  shipOnlyFor?: readonly DestinationId[]
}

export const ORIGIN_LABEL = 'Gebze Fabrikası'

/**
 * Gebze (Kocaeli) merkez → varış il merkezi, tipik en kısa karayolu mesafeleri.
 * Değerler; yol haritası / mesafe sitelerindeki otomobil güzergâhı (TEM–O-4 vb.)
 * ortalamalarına göre yuvarlanmıştır; navigasyon uygulamaları güzergâha göre ±birkaç km fark gösterebilir.
 */
export const DISTANCES_KM: Record<DestinationId, number> = {
  Ankara: 418,
  İzmir: 508,
  Manisa: 407,
  Mersin: 902,
  Kars: 1398,
}

/** Ödünleşim: düşük km maliyeti ↔ yüksek emisyon (ton-km başına) */
export const VEHICLES: readonly VehicleDef[] = [
  {
    id: 'truck',
    name: 'Ağır Tır',
    costPerKm: 10,
    emissionGPerTonKm: 150,
  },
  {
    id: 'train',
    name: 'Elektrikli Tren',
    costPerKm: 25,
    emissionGPerTonKm: 40,
  },
  {
    id: 'ship',
    name: 'Gemi',
    costPerKm: 45,
    emissionGPerTonKm: 20,
    shipOnlyFor: ['İzmir', 'Mersin'],
  },
] as const

export interface LegResult {
  vehicle: VehicleDef
  distanceKm: number
  loadTon: number
  totalEmissionTon: number
  logisticsCostTl: number
  carbonTaxTl: number
  totalCostTl: number
}

export function isVehicleAllowed(
  vehicle: VehicleDef,
  destination: DestinationId,
): boolean {
  if (vehicle.id !== 'ship') return true
  return vehicle.shipOnlyFor?.includes(destination) ?? false
}

export function computeLeg(
  distanceKm: number,
  loadTon: number,
  vehicle: VehicleDef,
  carbonTaxPerTonCo2: number,
): LegResult {
  const totalEmissionTon =
    (distanceKm * loadTon * vehicle.emissionGPerTonKm) / 1_000_000
  const logisticsCostTl = distanceKm * vehicle.costPerKm
  const carbonTaxTl = totalEmissionTon * carbonTaxPerTonCo2
  const totalCostTl = logisticsCostTl + carbonTaxTl
  return {
    vehicle,
    distanceKm,
    loadTon,
    totalEmissionTon,
    logisticsCostTl,
    carbonTaxTl,
    totalCostTl,
  }
}

export function getOptionsForDestination(
  destination: DestinationId,
  loadTon: number,
  carbonTaxPerTonCo2: number,
): LegResult[] {
  const distanceKm = DISTANCES_KM[destination]
  return VEHICLES.filter((v) => isVehicleAllowed(v, destination)).map((v) =>
    computeLeg(distanceKm, loadTon, v, carbonTaxPerTonCo2),
  )
}

export function pickOptimum(
  options: LegResult[],
  goal: OptimizationGoal,
): LegResult | null {
  if (options.length === 0) return null
  const key = goal === 'cost' ? 'totalCostTl' : 'totalEmissionTon'
  return options.reduce((best, cur) =>
    cur[key] < best[key] ? cur : best,
  )
}
