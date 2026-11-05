import { Database, Code, Copy, Check, Link2, Upload, Filter, Plus } from './icons';
import { SQL_DDL_SCHEMA } from '../data/initialData';

export default function DatabaseExplorer({ view }) {
  const {
    setActiveSnapshotModal,
    activeDbTab,
    setActiveDbTab,
    dbSensors,
    dbDetections,
    dbPredictions,
    dbAlerts,
    uploadClassPreset,
    setUploadClassPreset,
    alertFilterStatus,
    setAlertFilterStatus,
    highlightedChain,
    setHighlightedChain,
    copiedSql,
    injectDatabaseRecord,
    handleAnalyzeFrame,
    filteredAlerts,
    handleUpdateAlertStatus,
    handleInspectAlertRelation,
    handleCopySql
  } = view;

  return (
    <section
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: '#16191F',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Section Header */}
      <div
        className="px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
      >
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#22C55E]" />
            <h2 className="text-sm sm:text-base font-semibold text-[#F8FAFC]">
              Database
            </h2>
            <span
              className="text-[11px] font-mono px-2 py-0.5 rounded text-[#94A3B8]"
              style={{
                backgroundColor: '#0F1115',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              4 tables
            </span>
          </div>
        </div>

        {/* 4-Tab Selector + SQL DDL Reference */}
        <div
          className="inline-flex flex-wrap items-center rounded-md p-1 gap-1 text-xs font-mono"
          style={{
            backgroundColor: '#0F1115',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          {[
            { id: 'sensor_readings', label: 'Sensors', count: dbSensors.length },
            { id: 'camera_detections', label: 'Camera', count: dbDetections.length },
            { id: 'risk_predictions', label: 'Risk', count: dbPredictions.length },
            { id: 'alerts', label: 'Alerts', count: dbAlerts.length },
            { id: 'schema_overview', label: 'SQL', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDbTab(tab.id)}
              className={`px-2.5 py-1.5 rounded transition-colors flex items-center gap-1.5 ${activeDbTab === tab.id
                ? 'bg-[#1D222A] text-[#F8FAFC] font-medium'
                : 'text-[#71717A] hover:text-[#94A3B8]'
                }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#0F1115] text-[#94A3B8]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Relational Chain Breadcrumb Bar */}
      <div
        className="px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs"
        style={{
          backgroundColor: '#12151A',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#94A3B8]">
          <Link2 className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>Relations:</span>
          <button
            onClick={() => setActiveDbTab('sensor_readings')}
            className="px-2 py-0.5 rounded bg-[#16191F] text-[#F8FAFC] hover:bg-[#1D222A] border border-white/[0.06]"
          >
            Sensor {highlightedChain.sensorId ? `#${highlightedChain.sensorId}` : ''}
          </button>
          <span>→</span>
          <button
            onClick={() => setActiveDbTab('risk_predictions')}
            className="px-2 py-0.5 rounded bg-[#16191F] text-[#F8FAFC] hover:bg-[#1D222A] border border-white/[0.06]"
          >
            Prediction {highlightedChain.predictionId ? `#${highlightedChain.predictionId}` : ''}
          </button>
          <span>→</span>
          <button
            onClick={() => setActiveDbTab('alerts')}
            className="px-2 py-0.5 rounded bg-[#16191F] text-[#F8FAFC] hover:bg-[#1D222A] border border-white/[0.06]"
          >
            Alert {highlightedChain.alertId ? `#${highlightedChain.alertId}` : ''}
          </button>
        </div>

        <button
          onClick={() => injectDatabaseRecord()}
          className="inline-flex items-center gap-1 text-xs font-mono text-[#22C55E] hover:underline"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add sample</span>
        </button>
      </div>

      {/* TAB 1: sensor_readings */}
      {activeDbTab === 'sensor_readings' && (
        <div>
          <div className="px-5 py-3 bg-[#14171D] border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#94A3B8]">
            <strong className="text-[#F8FAFC] font-mono">sensor_readings</strong>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-mono uppercase text-[#71717A] bg-[#12151A] border-b border-white/[0.08]">
                  <th className="py-2.5 px-4">id</th>
                  <th className="py-2.5 px-4">temperature</th>
                  <th className="py-2.5 px-4">air_humidity</th>
                  <th className="py-2.5 px-4">soil_moisture</th>
                  <th className="py-2.5 px-4">fire_sensor</th>
                  <th className="py-2.5 px-4">recorded_at</th>
                  <th className="py-2.5 px-4 text-right">Linked Prediction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs font-mono">
                {dbSensors.map((row) => {
                  const isHighlighted = highlightedChain.sensorId === row.id;
                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors hover:bg-[#1D222A]/70 ${isHighlighted ? 'bg-[#1D222A]/90' : ''
                        }`}
                    >
                      <td className="py-3 px-4 font-semibold text-[#F8FAFC]">{row.id}</td>
                      <td
                        className="py-3 px-4"
                        style={{
                          color:
                            row.temperature >= 55
                              ? '#EF4444'
                              : row.temperature >= 42
                                ? '#F59E0B'
                                : '#F8FAFC'
                        }}
                      >
                        {row.temperature.toFixed(1)}°C
                      </td>
                      <td className="py-3 px-4 text-[#F8FAFC]">{row.air_humidity}%</td>
                      <td
                        className="py-3 px-4"
                        style={{
                          color: row.soil_moisture < 22 ? '#F59E0B' : '#F8FAFC'
                        }}
                      >
                        {row.soil_moisture}%
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-0.5 rounded text-[11px]"
                          style={{
                            backgroundColor:
                              row.fire_sensor === 1
                                ? 'rgba(239, 68, 68, 0.16)'
                                : 'rgba(34, 197, 94, 0.12)',
                            color: row.fire_sensor === 1 ? '#EF4444' : '#22C55E'
                          }}
                        >
                          {row.fire_sensor}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#94A3B8]">{row.recorded_at}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setHighlightedChain((prev) => ({ ...prev, sensorId: row.id }));
                            setActiveDbTab('risk_predictions');
                          }}
                          className="px-2 py-1 rounded text-[11px] bg-[#0F1115] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/[0.08]"
                        >
                          View risk →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: camera_detections */}
      {activeDbTab === 'camera_detections' && (
        <div>
          <div className="px-5 py-3 bg-[#14171D] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs text-[#94A3B8]">
            <strong className="text-[#F8FAFC] font-mono">camera_detections</strong>

            {/* Frame analysis controls */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-[#71717A]">Class:</span>
              <div
                className="inline-flex rounded p-0.5 text-[11px] font-mono"
                style={{
                  backgroundColor: '#0F1115',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                {['smoke', 'fire', 'normal'].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setUploadClassPreset(cls)}
                    className={`px-2 py-0.5 rounded uppercase ${uploadClassPreset === cls
                      ? 'bg-[#1D222A] text-[#F8FAFC]'
                      : 'text-[#71717A]'
                      }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleAnalyzeFrame(uploadClassPreset)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium bg-[#1D222A] text-[#F8FAFC] hover:bg-[#272D38] border border-white/[0.12]"
              >
                <Upload className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Analyze frame</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-mono uppercase text-[#71717A] bg-[#12151A] border-b border-white/[0.08]">
                  <th className="py-2.5 px-4">id</th>
                  <th className="py-2.5 px-4">camera</th>
                  <th className="py-2.5 px-4">image_path</th>
                  <th className="py-2.5 px-4">detected_class</th>
                  <th className="py-2.5 px-4">confidence</th>
                  <th className="py-2.5 px-4">bbox</th>
                  <th className="py-2.5 px-4">detected_at</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs font-mono">
                {dbDetections.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-[#1D222A]/70">
                    <td className="py-3 px-4 font-semibold text-[#F8FAFC]">{row.id}</td>
                    <td className="py-3 px-4 text-[#F8FAFC]">{row.camera}</td>
                    <td className="py-3 px-4 text-[#94A3B8]">{row.image_path}</td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-0.5 rounded text-[11px] uppercase font-medium"
                        style={{
                          backgroundColor:
                            row.detected_class === 'fire'
                              ? 'rgba(239, 68, 68, 0.16)'
                              : row.detected_class === 'smoke'
                                ? 'rgba(245, 158, 11, 0.16)'
                                : 'rgba(148, 163, 184, 0.12)',
                          color:
                            row.detected_class === 'fire'
                              ? '#EF4444'
                              : row.detected_class === 'smoke'
                                ? '#F59E0B'
                                : '#94A3B8'
                        }}
                      >
                        {row.detected_class}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#F8FAFC]">{Math.round(row.confidence * 100)}%</td>
                    <td className="py-3 px-4 text-[#94A3B8]">{row.bbox}</td>
                    <td className="py-3 px-4 text-[#94A3B8]">{row.detected_at}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          setActiveSnapshotModal({
                            id: `DET-${row.id}`,
                            timestamp: row.detected_at,
                            source: `${row.camera} (${row.image_path})`,
                            reading: `${row.detected_class} (${Math.round(row.confidence * 100)}%)`,
                            snapshotMeta: row.snapshotMeta
                          })
                        }
                        className="px-2.5 py-1 rounded text-[11px] bg-[#1D222A] text-[#F8FAFC] hover:bg-[#272D38] border border-white/[0.1]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: risk_predictions */}
      {activeDbTab === 'risk_predictions' && (
        <div>
          <div className="px-5 py-3 bg-[#14171D] border-b border-white/[0.06] flex flex-col lg:flex-row lg:items-center justify-between gap-2 text-xs text-[#94A3B8]">
            <strong className="text-[#F8FAFC] font-mono">risk_predictions</strong>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-mono uppercase text-[#71717A] bg-[#12151A] border-b border-white/[0.08]">
                  <th className="py-2.5 px-4">id</th>
                  <th className="py-2.5 px-4">sensor_reading (FK)</th>
                  <th className="py-2.5 px-4">risk_level</th>
                  <th className="py-2.5 px-4">risk_score</th>
                  <th className="py-2.5 px-4">model_version</th>
                  <th className="py-2.5 px-4">predicted_at</th>
                  <th className="py-2.5 px-4 text-right">Foreign-Key Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs font-mono">
                {dbPredictions.map((row) => {
                  const isHighlighted =
                    highlightedChain.predictionId === row.id ||
                    highlightedChain.sensorId === row.sensor_reading;
                  const riskStatus =
                    row.risk_level === 'high'
                      ? 'Bahaya'
                      : row.risk_level === 'medium'
                        ? 'Waspada'
                        : 'Aman';
                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors hover:bg-[#1D222A]/70 ${isHighlighted ? 'bg-[#1D222A]/90' : ''
                        }`}
                    >
                      <td className="py-3 px-4 font-semibold text-[#F8FAFC]">{row.id}</td>
                      <td className="py-3 px-4 text-[#22C55E]">
                        {row.sensor_reading}{' '}
                        <span className="text-[#71717A]">(sensor_readings.id)</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] uppercase font-medium"
                          style={{
                            backgroundColor:
                              row.risk_level === 'high'
                                ? 'rgba(239, 68, 68, 0.16)'
                                : row.risk_level === 'medium'
                                  ? 'rgba(245, 158, 11, 0.16)'
                                  : 'rgba(34, 197, 94, 0.12)',
                            color:
                              row.risk_level === 'high'
                                ? '#EF4444'
                                : row.risk_level === 'medium'
                                  ? '#F59E0B'
                                  : '#22C55E'
                          }}
                        >
                          {row.risk_level} · {riskStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#F8FAFC]">
                        {row.risk_score.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-[#94A3B8]">{row.model_version}</td>
                      <td className="py-3 px-4 text-[#94A3B8]">{row.predicted_at}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setHighlightedChain({
                              sensorId: row.sensor_reading,
                              predictionId: row.id,
                              alertId: null
                            });
                            setActiveDbTab('sensor_readings');
                          }}
                          className="px-2 py-1 rounded text-[11px] bg-[#0F1115] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/[0.08]"
                        >
                          ← View sensor #{row.sensor_reading}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: alerts */}
      {activeDbTab === 'alerts' && (
        <div>
          <div className="px-5 py-3 bg-[#14171D] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs text-[#94A3B8]">
            <strong className="text-[#F8FAFC] font-mono">alerts</strong>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Filter className="w-3.5 h-3.5 text-[#71717A]" />
              <span>Filter:</span>
              {['all', 'active', 'resolved', 'dismissed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setAlertFilterStatus(st)}
                  className={`px-2 py-0.5 rounded uppercase ${alertFilterStatus === st
                    ? 'bg-[#1D222A] text-[#F8FAFC]'
                    : 'text-[#71717A] hover:text-[#94A3B8]'
                    }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[11px] font-mono uppercase text-[#71717A] bg-[#12151A] border-b border-white/[0.08]">
                  <th className="py-2.5 px-4">id</th>
                  <th className="py-2.5 px-4">prediction (FK)</th>
                  <th className="py-2.5 px-4">alert_type</th>
                  <th className="py-2.5 px-4">message</th>
                  <th className="py-2.5 px-4">created_at</th>
                  <th className="py-2.5 px-4">status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs font-mono">
                {filteredAlerts.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-[#1D222A]/70">
                    <td className="py-3 px-4 font-semibold text-[#F8FAFC]">{row.id}</td>
                    <td className="py-3 px-4 text-[#F59E0B]">
                      {row.prediction}{' '}
                      <span className="text-[#71717A]">(risk_predictions.id)</span>
                    </td>
                    <td
                      className="py-3 px-4 font-medium"
                      style={{
                        color:
                          row.alert_type === 'high fire risk' ? '#EF4444' : '#F59E0B'
                      }}
                    >
                      {row.alert_type}
                    </td>
                    <td className="py-3 px-4 font-sans text-[#F8FAFC]">{row.message}</td>
                    <td className="py-3 px-4 text-[#94A3B8]">{row.created_at}</td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2 py-0.5 rounded text-[11px] uppercase font-medium"
                        style={{
                          backgroundColor:
                            row.status === 'active'
                              ? 'rgba(239, 68, 68, 0.18)'
                              : row.status === 'resolved'
                                ? 'rgba(34, 197, 94, 0.12)'
                                : 'rgba(148, 163, 184, 0.12)',
                          color:
                            row.status === 'active'
                              ? '#EF4444'
                              : row.status === 'resolved'
                                ? '#22C55E'
                                : '#94A3B8'
                        }}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {row.status !== 'resolved' && (
                          <button
                            onClick={() => handleUpdateAlertStatus(row.id, 'resolved')}
                            className="px-2 py-1 rounded text-[11px] bg-[#0F1115] text-[#22C55E] hover:bg-[#1D222A] border border-white/[0.08]"
                          >
                            Resolve
                          </button>
                        )}
                        {row.status !== 'dismissed' && (
                          <button
                            onClick={() => handleUpdateAlertStatus(row.id, 'dismissed')}
                            className="px-2 py-1 rounded text-[11px] bg-[#0F1115] text-[#94A3B8] hover:text-[#F8FAFC] border border-white/[0.08]"
                          >
                            Dismiss
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleInspectAlertRelation(row);
                            setActiveDbTab('risk_predictions');
                          }}
                          className="px-2 py-1 rounded text-[11px] bg-[#0F1115] text-[#F8FAFC] hover:bg-[#1D222A] border border-white/[0.08]"
                        >
                          FK #{row.prediction}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ER Schema & SQL DDL Reference */}
      {activeDbTab === 'schema_overview' && (
        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 6 Cols: 4-Table Specification Cards */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">
              Table overview
            </h3>

            <div className="p-3.5 rounded bg-[#0F1115] border border-white/[0.08] space-y-1">
              <div className="text-xs font-mono font-semibold text-[#22C55E]">
                1. sensor_readings
              </div>
              <p className="text-xs text-[#94A3B8]">
                Sensor and environmental readings.
              </p>
            </div>

            <div className="p-3.5 rounded bg-[#0F1115] border border-white/[0.08] space-y-1">
              <div className="text-xs font-mono font-semibold text-[#38BDF8]">
                2. camera_detections
              </div>
              <p className="text-xs text-[#94A3B8]">
                Camera frames and detections.
              </p>
            </div>

            <div className="p-3.5 rounded bg-[#0F1115] border border-white/[0.08] space-y-1">
              <div className="text-xs font-mono font-semibold text-[#F59E0B]">
                3. risk_predictions
              </div>
              <p className="text-xs text-[#94A3B8]">
                Risk scores and model output.
              </p>
            </div>

            <div className="p-3.5 rounded bg-[#0F1115] border border-white/[0.08] space-y-1">
              <div className="text-xs font-mono font-semibold text-[#EF4444]">
                4. alerts
              </div>
              <p className="text-xs text-[#94A3B8]">
                Alert history and status.
              </p>
            </div>
          </div>

          {/* Right 6 Cols: Copyable SQL DDL */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded bg-[#0F1115] border border-white/[0.08] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#F8FAFC]">
                <Code className="w-4 h-4 text-[#22C55E]" />
                <span>schema.sql</span>
              </div>
              <button
                onClick={handleCopySql}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono bg-[#16191F] text-[#F8FAFC] hover:bg-[#1D222A] border border-white/[0.08]"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-[#94A3B8] overflow-x-auto leading-relaxed">
              {SQL_DDL_SCHEMA}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
