import { Camera, Play, Pause, Eye, EyeOff, Battery, CheckCircle2 } from './icons.js';
import {
  ResponsiveContainer, ComposedChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine
} from 'recharts';

export default function CameraTrendsSection({ view }) {
  const {
    simState,
    streamPaused,
    setStreamPaused,
    showOverlay,
    setShowOverlay,
    timeRange,
    setTimeRange,
    chartMode,
    setChartMode,
    snapshotBanner,
    dbDetections,
    metrics,
    frameTick,
    injectDatabaseRecord,
    displayedChartData } = view;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Panel: Single Mobile Camera Feed (55% -> 7 of 12 cols) */}
      <div
        className="lg:col-span-7 rounded-lg flex flex-col justify-between overflow-hidden"
        style={{
          backgroundColor: '#16191F',
          border:
            simState === 'critical'
              ? '1px solid rgba(239, 68, 68, 0.45)'
              : '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Panel Header */}
        <div
          className="px-4 py-3 flex flex-wrap items-center justify-between gap-2"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#94A3B8]" />
            <h2 className="text-sm font-semibold text-[#F8FAFC]">
              Camera · CAM-01
            </h2>
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded"
              style={{
                backgroundColor: '#0F1115',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: streamPaused ? '#F59E0B' : '#22C55E'
              }}
            >
              {streamPaused ? 'PAUSED' : 'LIVE'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-[#94A3B8]">
            <span className="flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-[#22C55E]" />
              {metrics.phoneBattery}%
            </span>
            <span className="text-[#71717A]">·</span>
            <span>Phone: {metrics.phoneTemp.toFixed(1)}°C</span>
          </div>
        </div>

        {/* Video Feed Window */}
        <div className="relative w-full aspect-[16/9] bg-[#0B0D11] overflow-hidden select-none">
          <svg
            viewBox="0 0 800 450"
            className="w-full h-full object-cover"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={simState === 'critical' ? '#241B1E' : '#18202C'}
                />
                <stop
                  offset="55%"
                  stopColor={simState === 'critical' ? '#332324' : '#252F3D'}
                />
                <stop offset="100%" stopColor="#2C3539" />
              </linearGradient>
              <linearGradient id="ridgeFar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#232B28" />
                <stop offset="100%" stopColor="#181E1C" />
              </linearGradient>
              <linearGradient id="ridgeMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2A3025" />
                <stop offset="100%" stopColor="#1B2019" />
              </linearGradient>
              <linearGradient id="foregroundBrush" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#333728" />
                <stop offset="100%" stopColor="#181A14" />
              </linearGradient>
            </defs>

            <rect width="800" height="450" fill="url(#skyGrad)" />
            <polygon
              points="0,230 95,195 190,210 310,168 430,198 540,162 670,185 800,170 800,320 0,320"
              fill="url(#ridgeFar)"
            />
            <polygon
              points="0,265 120,245 240,268 380,222 490,238 615,215 730,245 800,235 800,370 0,370"
              fill="url(#ridgeMid)"
            />
            {[140, 165, 290, 315, 360, 382, 415, 445, 510, 535, 595, 625, 660].map(
              (xPos, idx) => (
                <polygon
                  key={idx}
                  points={`${xPos},${218 + (idx % 3) * 8} ${xPos - 9},${248 + (idx % 3) * 8
                    } ${xPos + 9},${248 + (idx % 3) * 8}`}
                  fill="#1E241B"
                />
              )
            )}
            <polygon
              points="0,315 210,295 460,312 690,288 800,300 800,450 0,450"
              fill="url(#foregroundBrush)"
            />

            {/* Simulated Smoke Plume */}
            {(simState === 'warning' || simState === 'critical') && (
              <g opacity={simState === 'critical' ? 0.85 : 0.65}>
                <ellipse
                  cx={415 + Math.sin(frameTick * 0.2) * 4}
                  cy={198}
                  rx={34}
                  ry={20}
                  fill="#64748B"
                  opacity="0.45"
                />
                <ellipse
                  cx={432 + Math.cos(frameTick * 0.15) * 5}
                  cy={168}
                  rx={48}
                  ry={28}
                  fill="#94A3B8"
                  opacity="0.40"
                />
                <ellipse
                  cx={450 + Math.sin(frameTick * 0.1) * 6}
                  cy={132}
                  rx={64}
                  ry={34}
                  fill="#94A3B8"
                  opacity="0.30"
                />
                <ellipse
                  cx={402}
                  cy={222}
                  rx={24}
                  ry={16}
                  fill="#475569"
                  opacity="0.55"
                />
              </g>
            )}

            {/* Simulated Active Fire */}
            {simState === 'critical' && (
              <g>
                <ellipse cx={418} cy={242} rx={36} ry={18} fill="#EF4444" opacity="0.35" />
                <polygon
                  points={`395,254 ${404 + (frameTick % 3)},218 416,244 ${424 - (frameTick % 2)
                    },210 435,245 444,225 450,255`}
                  fill="#EF4444"
                />
                <polygon
                  points={`403,254 412,${228 + (frameTick % 3)} 422,246 429,${222 - (frameTick % 2)
                    } 439,254`}
                  fill="#F59E0B"
                />
                <polygon points="412,254 420,236 428,254" fill="#FEF08A" />
              </g>
            )}
          </svg>

          {/* Top-Left Stream Watermark */}
          <div
            className="absolute top-3 left-3 px-2.5 py-1.5 rounded text-xs font-mono flex items-center gap-2"
            style={{
              backgroundColor: 'rgba(15, 17, 21, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: streamPaused ? '#F59E0B' : '#22C55E' }}
            />
            <span className="text-[#F8FAFC] font-medium">CAM-01</span>
            <span className="text-[#71717A]">·</span>
            <span className="text-[#94A3B8]">{dbDetections[0]?.image_path}</span>
            <span className="text-[#71717A]">·</span>
            <span className="text-[#F8FAFC] tabular-nums">
              class: {metrics.detectedClass} ({Math.round(metrics.visionConfidence * 100)}%)
            </span>
          </div>

          {/* Top-Right Resolution & FPS Overlay */}
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded text-[11px] font-mono text-[#94A3B8]"
            style={{
              backgroundColor: 'rgba(15, 17, 21, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            1080p · {metrics.fps.toFixed(1)} FPS
          </div>

          {/* Minimalist Object Detection Bounding Boxes */}
          {showOverlay && (simState === 'warning' || simState === 'critical') && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Smoke Bounding Box */}
              <div
                className="absolute transition-all duration-300"
                style={{
                  left: '41%',
                  top: '18%',
                  width: '32%',
                  height: '38%',
                  border: '1.5px solid #F59E0B'
                }}
              >
                <div
                  className="absolute -top-6 left-[-1.5px] px-1.5 py-0.5 text-[11px] font-mono tabular-nums font-medium text-[#0F1115] whitespace-nowrap"
                  style={{ backgroundColor: '#F59E0B' }}
                >
                  Smoke · 94%
                </div>
              </div>

              {/* Fire Bounding Box */}
              {simState === 'critical' && (
                <div
                  className="absolute transition-all duration-300"
                  style={{
                    left: '46%',
                    top: '44%',
                    width: '18%',
                    height: '22%',
                    border: '1.5px solid #EF4444'
                  }}
                >
                  <div
                    className="absolute -top-6 left-[-1.5px] px-1.5 py-0.5 text-[11px] font-mono tabular-nums font-medium text-[#F8FAFC] whitespace-nowrap"
                    style={{ backgroundColor: '#EF4444' }}
                  >
                    Fire · 96%
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Snapshot / DB Injection Notification Banner */}
          {snapshotBanner && (
            <div
              className="absolute bottom-3 left-3 px-3 py-1.5 rounded text-xs font-mono text-[#F8FAFC] flex items-center gap-2"
              style={{
                backgroundColor: 'rgba(22, 25, 31, 0.95)',
                border: '1px solid rgba(34, 197, 94, 0.45)'
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>{snapshotBanner}</span>
            </div>
          )}
        </div>

        {/* Stream Control Bar */}
        <div
          className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs"
          style={{
            backgroundColor: '#16191F',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStreamPaused((p) => !p)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-medium text-[#F8FAFC] transition-colors hover:bg-[#1D222A]"
              style={{
                backgroundColor: '#0F1115',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              {streamPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <button
              onClick={() => injectDatabaseRecord()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-medium text-[#F8FAFC] transition-colors hover:bg-[#1D222A]"
              style={{
                backgroundColor: '#0F1115',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <Camera className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Snapshot</span>
            </button>

            <button
              onClick={() => setShowOverlay((o) => !o)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors hover:bg-[#1D222A]"
              style={{
                backgroundColor: showOverlay ? '#1D222A' : '#0F1115',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: showOverlay ? '#F8FAFC' : '#94A3B8'
              }}
            >
              {showOverlay ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Overlay on</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-[#71717A]" />
                  <span>Overlay off</span>
                </>
              )}
            </button>
          </div>

          <div className="text-[11px] font-mono text-[#71717A]">
            Latest: <span className="text-[#F8FAFC]">{dbDetections[0]?.image_path}</span>
          </div>
        </div>
      </div>

      {/* Sensor trends */}
      <div
        className="lg:col-span-5 rounded-lg flex flex-col justify-between p-4 sm:p-5"
        style={{
          backgroundColor: '#16191F',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div>
          {/* Panel Header & Mode / Time Selectors */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3.5 border-b border-white/[0.08]">
            <div>
              <h2 className="text-sm font-semibold text-[#F8FAFC]">
                Sensor Trends
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <div
                className="inline-flex rounded p-0.5 text-[11px] font-mono"
                style={{
                  backgroundColor: '#0F1115',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <button
                  onClick={() => setChartMode('MOISTURE')}
                  className={`px-2 py-1 rounded ${chartMode === 'MOISTURE'
                    ? 'bg-[#1D222A] text-[#F8FAFC]'
                    : 'text-[#71717A]'
                    }`}
                >
                  Moisture
                </button>
                <button
                  onClick={() => setChartMode('RISK')}
                  className={`px-2 py-1 rounded ${chartMode === 'RISK'
                    ? 'bg-[#1D222A] text-[#F8FAFC]'
                    : 'text-[#71717A]'
                    }`}
                >
                  Risk
                </button>
              </div>

              <div
                className="inline-flex rounded p-0.5 text-[11px] font-mono"
                style={{
                  backgroundColor: '#0F1115',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                {['15m', '1h', '6h', '24h'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-1.5 py-1 rounded transition-colors ${timeRange === range
                      ? 'bg-[#1D222A] text-[#F8FAFC] font-medium'
                      : 'text-[#71717A] hover:text-[#94A3B8]'
                      }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#EF4444] inline-block" />
                <span className="text-[#94A3B8]">Temperature</span>
              </div>
              {chartMode === 'MOISTURE' ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-[#38BDF8] inline-block" />
                    <span className="text-[#94A3B8]">Air humidity</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-[#22C55E] inline-block" />
                    <span className="text-[#94A3B8]">Soil moisture</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#F59E0B] inline-block" />
                  <span className="text-[#94A3B8]">Risk score</span>
                </div>
              )}
            </div>
          </div>

          {/* Recharts Multi-Line Chart */}
          <div className="h-[280px] sm:h-[310px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={displayedChartData}
                margin={{ top: 10, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  stroke="#71717A"
                  tick={{ fill: '#71717A', fontSize: 11, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
                />
                <YAxis
                  yAxisId="left"
                  domain={[15, 75]}
                  stroke="#71717A"
                  tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                  unit="°"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={chartMode === 'MOISTURE' ? [0, 100] : [0, 1]}
                  stroke="#71717A"
                  tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F1115',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#F8FAFC'
                  }}
                />
                <ReferenceLine
                  yAxisId="left"
                  y={55}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  strokeOpacity={0.65}
                  label={{
                    value: '55°C alarm',
                    position: 'insideTopLeft',
                    fill: '#EF4444',
                    fontSize: 10,
                    fontFamily: 'monospace'
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temp"
                  name="Temperature"
                  stroke="#EF4444"
                  strokeWidth={1.75}
                  dot={false}
                  isAnimationActive={false}
                />
                {chartMode === 'MOISTURE' ? (
                  <>
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="air_humidity"
                      name="Air humidity"
                      stroke="#38BDF8"
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="soil_moisture"
                      name="Soil moisture"
                      stroke="#22C55E"
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </>
                ) : (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="risk_score"
                    name="risk_score"
                    stroke="#F59E0B"
                    strokeWidth={1.75}
                    dot={false}
                    isAnimationActive={false}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="mt-4 pt-3 flex items-center justify-between text-xs"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <span className="text-[#94A3B8]">
            Flame sensor:{' '}
            <span
              className="font-mono font-semibold"
              style={{ color: metrics.fireSensor === 1 ? '#EF4444' : '#22C55E' }}
            >
              {metrics.fireSensor === 1 ? 'Active' : 'Normal'}
            </span>
          </span>
          <span className="font-mono tabular-nums text-[#71717A]">
            Range: {timeRange} ({displayedChartData.length} samples)
          </span>
        </div>
      </div>
    </section>
  );
}
