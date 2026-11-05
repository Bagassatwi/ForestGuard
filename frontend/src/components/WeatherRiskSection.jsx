import { CloudSun, Compass, Gauge, Sun, CloudRain } from './icons.js';

export default function WeatherRiskSection({ view }) {
  const {
    simState,
    moistureMode,
    setMoistureTypeNote,
    dbSensors,
    metrics,
    liveRiskPrediction,
    threatAssessment } = view;

  return (
    <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
      {/* Left 7 Cols: CURRENT WEATHER CONDITION BAR / PANEL */}
      <div
        className="xl:col-span-7 rounded-lg p-4 sm:p-5 flex flex-col justify-between"
        style={{
          backgroundColor: '#16191F',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div>
          {/* Weather Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3.5 border-b border-white/8">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{
                  backgroundColor: '#0F1115',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <CloudSun className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-[#F8FAFC]">
                    Weather · Bromo-Tengger
                  </h2>
                </div>
                <p className="text-xs text-[#71717A] mt-0.5">
                  1,420 m · Live
                </p>
              </div>
            </div>

            {/* Moisture display mode */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#71717A] hidden sm:inline">Moisture:</span>
              <div
                className="inline-flex items-center rounded p-0.5 text-[11px] font-mono"
                style={{
                  backgroundColor: '#0F1115',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <button
                  onClick={() => setMoistureTypeNote('soil')}
                  className={`px-2 py-0.5 rounded transition-colors ${moistureMode === 'soil'
                    ? 'bg-[#1D222A] text-[#F8FAFC]'
                    : 'text-[#71717A] hover:text-[#94A3B8]'
                    }`}
                >
                  Soil moisture
                </button>
                <button
                  onClick={() => setMoistureTypeNote('fmc')}
                  className={`px-2 py-0.5 rounded transition-colors ${moistureMode === 'fmc'
                    ? 'bg-[#1D222A] text-[#F8FAFC]'
                    : 'text-[#71717A] hover:text-[#94A3B8]'
                    }`}
                >
                  FMC
                </button>
              </div>
            </div>
          </div>

          {/* 5-Column Meteorological Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {/* 1. Weather Condition & Ambient */}
            <div
              className="p-3 rounded-md"
              style={{
                backgroundColor: '#0F1115',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div className="flex items-center justify-between text-[11px] text-[#71717A]">
                <span>Weather</span>
                <CloudSun className="w-3.5 h-3.5 text-[#F59E0B]" />
              </div>
              <div className="text-sm font-semibold text-[#F8FAFC] mt-1 truncate">
                {simState === 'critical'
                  ? 'Extreme dry'
                  : simState === 'warning'
                    ? 'Smoke haze'
                    : 'Partly cloudy'}
              </div>
              <div className="text-[11px] font-mono text-[#94A3B8] mt-0.5">
                {metrics.temp.toFixed(1)}°C
              </div>
            </div>

            {/* 2. Wind Speed & Direction */}
            <div
              className="p-3 rounded-md"
              style={{
                backgroundColor: '#0F1115',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div className="flex items-center justify-between text-[11px] text-[#71717A]">
                <span>Wind</span>
                <Compass className="w-3.5 h-3.5 text-[#94A3B8]" />
              </div>
              <div className="text-base font-mono tabular-nums font-semibold text-[#F8FAFC] mt-1">
                {metrics.windSpeed} km/h {metrics.windDirection}
              </div>
            </div>

            {/* 3. Pressure */}
            <div
              className="p-3 rounded-md"
              style={{
                backgroundColor: '#0F1115',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div className="flex items-center justify-between text-[11px] text-[#71717A]">
                <span>Pressure</span>
                <Gauge className="w-3.5 h-3.5 text-[#94A3B8]" />
              </div>
              <div className="text-base font-mono tabular-nums font-semibold text-[#F8FAFC] mt-1">
                {metrics.pressure.toFixed(1)} hPa
              </div>
            </div>

            {/* 4. Solar Irradiance / UV Index */}
            <div
              className="p-3 rounded-md"
              style={{
                backgroundColor: '#0F1115',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div className="flex items-center justify-between text-[11px] text-[#71717A]">
                <span>Solar / UV</span>
                <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
              </div>
              <div className="text-base font-mono tabular-nums font-semibold text-[#F8FAFC] mt-1">
                {metrics.solarIrradiance} W/m² · UV {metrics.uvIndex}
              </div>
              <div className="text-[11px] font-mono text-[#F59E0B] mt-0.5">
                High UV
              </div>
            </div>

            {/* 5. Last Precipitation */}
            <div
              className="p-3 rounded-md col-span-2 sm:col-span-1"
              style={{
                backgroundColor: '#0F1115',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div className="flex items-center justify-between text-[11px] text-[#71717A]">
                <span>Precipitation</span>
                <CloudRain className="w-3.5 h-3.5 text-[#94A3B8]" />
              </div>
              <div className="text-base font-mono tabular-nums font-semibold text-[#F8FAFC] mt-1">
                {metrics.daysSinceRain} days ago
              </div>
              <div className="text-[11px] font-mono text-[#F59E0B] mt-0.5">
                {metrics.rainfall24h.toFixed(1)} mm / 24h
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Fire risk panel */}
      <div
        className="xl:col-span-5 rounded-lg p-4 sm:p-5 flex flex-col justify-between"
        style={{
          backgroundColor: '#16191F',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/[0.08]">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-[#F8FAFC]">
                Fire Risk
              </span>
              <p className="text-[11px] font-mono text-[#71717A] mt-0.5">
                Model {liveRiskPrediction.model_version} · #{dbSensors[0]?.id}
              </p>
            </div>

            <span
              className="text-xs font-mono uppercase px-2.5 py-1 rounded font-semibold"
              style={{
                backgroundColor: threatAssessment.bgSubtle,
                border: `1px solid ${threatAssessment.borderSubtle}`,
                color: threatAssessment.color
              }}
            >
              {liveRiskPrediction.statusLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Score Display */}
            <div className="sm:col-span-5 sm:border-r sm:pr-4 border-white/[0.08]">
              <div className="text-[11px] font-mono text-[#71717A]">Risk score</div>
              <div className="flex items-baseline gap-2 my-1">
                <span
                  className="text-3xl font-mono tabular-nums font-semibold"
                  style={{ color: threatAssessment.color }}
                >
                  {liveRiskPrediction.risk_score.toFixed(2)}
                </span>
                <span className="text-xs font-mono text-[#71717A]">/ 1.00</span>
              </div>

              <div className="w-full h-1.5 bg-[#0F1115] rounded-full overflow-hidden mt-2">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${Math.round(liveRiskPrediction.risk_score * 100)}%`,
                    backgroundColor: threatAssessment.color
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-[#71717A] mt-1.5">
                <span>0.0 Safe</span>
                <span>0.45 Watch</span>
                <span>0.75+ High</span>
              </div>
            </div>

            {/* Deterministic + AI Fusion Breakdown */}
            <div className="sm:col-span-7 space-y-1.5 text-xs font-mono">
              <div className="text-[11px] text-[#94A3B8] font-sans font-medium mb-1">
                Risk factors
              </div>
              <div className="flex items-center justify-between px-2.5 py-1 rounded bg-[#0F1115] border border-white/[0.06]">
                <span className="text-[#94A3B8]">Temperature ({metrics.temp.toFixed(1)}°C)</span>
                <span className="text-[#F8FAFC]">+{liveRiskPrediction.breakdown.tempContrib.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between px-2.5 py-1 rounded bg-[#0F1115] border border-white/[0.06]">
                <span className="text-[#94A3B8]">
                  Humidity + soil ({metrics.airHumidity}% / {metrics.soilMoisture}%)
                </span>
                <span className="text-[#F8FAFC]">+{liveRiskPrediction.breakdown.moistureContrib.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between px-2.5 py-1 rounded bg-[#0F1115] border border-white/[0.06]">
                <span className="text-[#94A3B8]">
                  Flame sensor + camera ({metrics.detectedClass})
                </span>
                <span
                  style={{
                    color:
                      liveRiskPrediction.breakdown.fireSensorContrib +
                        liveRiskPrediction.breakdown.visionContrib >
                        0
                        ? '#EF4444'
                        : '#94A3B8'
                  }}
                >
                  +
                  {(
                    liveRiskPrediction.breakdown.fireSensorContrib +
                    liveRiskPrediction.breakdown.visionContrib
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Digest Footer */}
        <div
          className="mt-3.5 pt-3 flex items-start gap-2 text-xs text-[#94A3B8]"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 mt-1"
            style={{ backgroundColor: threatAssessment.color }}
          />
          <div>
            <span>{threatAssessment.digest}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
