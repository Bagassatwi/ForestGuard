import { Thermometer, Droplets, Sprout, Flame } from './icons.js';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function MetricCards({ view }) {
  const {
    moistureMode,
    setMoistureTypeNote,
    sparklineData,
    metrics } = view;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Card 1: `temperature` (°C) */}
      <div
        className="rounded-lg p-4 sm:p-5 flex flex-col justify-between transition-colors hover:bg-[#1D222A]/60"
        style={{
          backgroundColor: '#16191F',
          border:
            metrics.temp >= 55
              ? '1px solid rgba(239, 68, 68, 0.45)'
              : metrics.temp >= 45
                ? '1px solid rgba(245, 158, 11, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div>
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
            <div className="flex items-center gap-1.5 font-medium text-[#F8FAFC]">
              <Thermometer className="w-4 h-4 text-[#94A3B8]" />
              <span>Temperature</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between my-1">
            <div
              className="text-3xl font-mono tabular-nums font-semibold"
              style={{
                color:
                  metrics.temp >= 55
                    ? '#EF4444'
                    : metrics.temp >= 45
                      ? '#F59E0B'
                      : '#F8FAFC'
              }}
            >
              {metrics.temp.toFixed(1)}°C
            </div>
            <div className="text-xs font-mono tabular-nums text-[#94A3B8]">
              Peak: <span className="text-[#F8FAFC]">{metrics.peakTemp.toFixed(1)}°C</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div className="h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke={
                    metrics.temp >= 55
                      ? '#EF4444'
                      : metrics.temp >= 45
                        ? '#F59E0B'
                        : '#94A3B8'
                  }
                  strokeWidth={1.5}
                  fill={
                    metrics.temp >= 55
                      ? 'rgba(239, 68, 68, 0.12)'
                      : 'rgba(148, 163, 184, 0.08)'
                  }
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Card 2: `air_humidity` (%) */}
      <div
        className="rounded-lg p-4 sm:p-5 flex flex-col justify-between transition-colors hover:bg-[#1D222A]/60"
        style={{
          backgroundColor: '#16191F',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div>
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
            <div className="flex items-center gap-1.5 font-medium text-[#F8FAFC]">
              <Droplets className="w-4 h-4 text-[#38BDF8]" />
              <span>Air Humidity</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between my-1">
            <div
              className="text-3xl font-mono tabular-nums font-semibold"
              style={{
                color:
                  metrics.airHumidity < 25
                    ? '#EF4444'
                    : metrics.airHumidity < 35
                      ? '#F59E0B'
                      : '#F8FAFC'
              }}
            >
              {metrics.airHumidity}%
            </div>
            <div className="text-xs font-mono text-[#94A3B8]">
              Safe: <span className="text-[#F8FAFC]">&gt; 35%</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div className="w-full h-1.5 bg-[#0F1115] rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${metrics.airHumidity}%`,
                backgroundColor:
                  metrics.airHumidity < 25
                    ? '#EF4444'
                    : metrics.airHumidity < 35
                      ? '#F59E0B'
                      : '#38BDF8'
              }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-[#71717A]">
            <span>Humidity sensor</span>
            <span className="text-[#94A3B8]">
              {metrics.airHumidity < 30 ? 'Dry' : 'Normal'}
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Soil / fuel moisture */}
      <div
        className="rounded-lg p-4 sm:p-5 flex flex-col justify-between transition-colors hover:bg-[#1D222A]/60"
        style={{
          backgroundColor: '#16191F',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div>
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
            <div className="flex items-center gap-1.5 font-medium text-[#F8FAFC]">
              <Sprout className="w-4 h-4 text-[#22C55E]" />
              <span>
                {moistureMode === 'soil' ? 'Soil Moisture' : 'Fuel Moisture (FMC)'}
              </span>
            </div>
          </div>

          <div className="flex items-baseline justify-between my-1">
            <div
              className="text-3xl font-mono tabular-nums font-semibold"
              style={{
                color:
                  metrics.soilMoisture < 18
                    ? '#EF4444'
                    : metrics.soilMoisture < 24
                      ? '#F59E0B'
                      : '#F8FAFC'
              }}
            >
              {moistureMode === 'soil'
                ? `${metrics.soilMoisture}%`
                : `${Math.max(8, metrics.soilMoisture - 11)}%`}
            </div>
            <button
              onClick={() =>
                setMoistureTypeNote((m) => (m === 'soil' ? 'fmc' : 'soil'))
              }
              className="text-[11px] font-mono text-[#94A3B8] underline hover:text-[#F8FAFC]"
            >
              Switch to {moistureMode === 'soil' ? 'FMC' : 'Soil'}
            </button>
          </div>
        </div>
      </div>

      {/* Card 4: Flame sensor */}
      <div
        className="rounded-lg p-4 sm:p-5 flex flex-col justify-between transition-colors hover:bg-[#1D222A]/60"
        style={{
          backgroundColor: '#16191F',
          border:
            metrics.fireSensor === 1
              ? '1px solid rgba(239, 68, 68, 0.5)'
              : '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div>
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
            <div className="flex items-center gap-1.5 font-medium text-[#F8FAFC]">
              <Flame
                className="w-4 h-4"
                style={{ color: metrics.fireSensor === 1 ? '#EF4444' : '#94A3B8' }}
              />
              <span>Flame Sensor</span>
            </div>
          </div>

          <div className="flex items-center justify-between my-1.5">
            <div className="flex items-center gap-2.5">
              <span
                className="text-3xl font-mono tabular-nums font-bold px-3 py-0.5 rounded"
                style={{
                  backgroundColor:
                    metrics.fireSensor === 1
                      ? 'rgba(239, 68, 68, 0.18)'
                      : 'rgba(34, 197, 94, 0.12)',
                  border:
                    metrics.fireSensor === 1
                      ? '1px solid rgba(239, 68, 68, 0.4)'
                      : '1px solid rgba(34, 197, 94, 0.3)',
                  color: metrics.fireSensor === 1 ? '#EF4444' : '#22C55E'
                }}
              >
                {metrics.fireSensor}
              </span>
              <div className="text-xs font-mono">
                <div
                  className="font-semibold"
                  style={{ color: metrics.fireSensor === 1 ? '#EF4444' : '#22C55E' }}
                >
                  {metrics.fireSensor === 1 ? 'ACTIVE' : 'NORMAL'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
