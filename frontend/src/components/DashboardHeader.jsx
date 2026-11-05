import { Flame, Smartphone, Wifi, CheckCircle2, AlertCircle, Clock, Plus } from './icons.js';
import { formatTimestamp } from '../utils/date.js';

export default function DashboardHeader({ view }) {
  const {
    simState,
    currentTime,
    metrics,
    injectDatabaseRecord,
    handleScenarioChange,
    threatAssessment } = view;

  return (
    <header
      className="sticky top-0 z-30 w-full px-4 sm:px-6 py-3"
      style={{
        backgroundColor: '#16191F',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      <div className="mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
        {/* Left: Project Title & Environment Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{
                backgroundColor: '#1D222A',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <Flame
                className="w-4 h-4"
                style={{
                  color:
                    simState === 'critical'
                      ? '#EF4444'
                      : simState === 'warning'
                        ? '#F59E0B'
                        : '#94A3B8'
                }}
              />
            </div>
            <span className="font-semibold tracking-tight text-sm sm:text-base text-[#F8FAFC]">
              PYROWATCH
            </span>
            <span className="text-[#71717A] text-sm">·</span>
            <span className="text-xs sm:text-sm text-[#94A3B8] font-medium">
              Forest Fire Monitor
            </span>
          </div>

          <span
            className="px-2 py-0.5 text-xs font-mono rounded text-[#94A3B8]"
            style={{
              backgroundColor: '#0F1115',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            Bromo-Tengger · Unit 01
          </span>
        </div>

        {/* Center: Alert Status Pill & Interactive Simulation Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-colors"
            style={{
              backgroundColor: threatAssessment.bgSubtle,
              border: `1px solid ${threatAssessment.borderSubtle}`,
              color: threatAssessment.color
            }}
          >
            {simState === 'nominal' ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            )}
            <span className="tracking-tight">{threatAssessment.statusPill}</span>
          </div>

          {/* Presentation State Simulator Switcher */}
          <div
            className="inline-flex items-center rounded-md p-0.5 text-xs"
            style={{
              backgroundColor: '#0F1115',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <span className="px-2 py-1 text-[11px] text-[#71717A] font-medium hidden sm:inline">
              Mode:
            </span>
            <button
              onClick={() => handleScenarioChange('nominal')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${simState === 'nominal'
                ? 'bg-[#1D222A] text-[#22C55E]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
            >
              Normal
            </button>
            <button
              onClick={() => handleScenarioChange('warning')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${simState === 'warning'
                ? 'bg-[#1D222A] text-[#F59E0B]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
            >
              Smoke
            </button>
            <button
              onClick={() => handleScenarioChange('critical')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${simState === 'critical'
                ? 'bg-[#EF4444] text-[#F8FAFC]'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
            >
              Fire
            </button>
          </div>

          <button
            onClick={() => injectDatabaseRecord()}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono text-[#F8FAFC] hover:bg-[#1D222A] transition-colors"
            style={{
              backgroundColor: '#0F1115',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}
            title="Save current readings"
          >
            <Plus className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Log Data</span>
          </button>
        </div>

        {/* Right: Stream Health, IoT Gateway Status & Timestamp */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#94A3B8]">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded"
            style={{
              backgroundColor: '#0F1115',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Camera connected</span>
            <span className="text-[#71717A]">·</span>
            <span className="font-mono tabular-nums text-[#F8FAFC]">
              1080p @ {Math.round(metrics.fps)} FPS
            </span>
            <span className="text-[#71717A]">·</span>
            <span className="font-mono tabular-nums text-[#94A3B8]">
              {metrics.phoneBattery}%
            </span>
          </div>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded"
            style={{
              backgroundColor: '#0F1115',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <Wifi className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>MQTT · {metrics.mqttLatency} ms</span>
          </div>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded font-mono tabular-nums text-[#F8FAFC]"
            style={{
              backgroundColor: '#0F1115',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <Clock className="w-3.5 h-3.5 text-[#71717A]" />
            <span>{formatTimestamp(currentTime)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
