"use client";
import { usePyroWatch } from '@/hooks/usePyroWatch';
import DashboardHeader from '@/components/DashboardHeader';
import WeatherRiskSection from '@/components/WeatherRiskSection';
import MetricCards from '@/components/MetricCards';
import CameraTrendsSection from '@/components/CameraTrendsSection';
import DatabaseExplorer from '@/components/DatabaseExplorer';
import SnapshotModal from '@/components/SnapshotModal';

export default function App() {
  const view = usePyroWatch();

  return (
    <div
      className="min-h-screen max-w-9xl w-full text-[#F8FAFC] antialiased selection:bg-[#27272A] selection:text-white"
      style={{
        backgroundColor: '#0F1115',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <DashboardHeader view={view} />

      <main className="mx-auto px-4 sm:px-6 py-5 space-y-5">
        <WeatherRiskSection view={view} />
        <MetricCards view={view} />
        <CameraTrendsSection view={view} />
        <DatabaseExplorer view={view} />
      </main>

      <SnapshotModal view={view} />
    </div>
  );
}
