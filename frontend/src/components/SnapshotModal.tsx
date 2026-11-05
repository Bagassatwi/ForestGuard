import { Camera, X } from './icons';

export default function SnapshotModal({ view }) {
  const {
    activeSnapshotModal,
    setActiveSnapshotModal } = view;

  return (
    <>
      {activeSnapshotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(10, 12, 16, 0.82)' }}
        >
          <div
            className="w-full max-w-2xl rounded-lg overflow-hidden"
            style={{
              backgroundColor: '#16191F',
              border: '1px solid rgba(255, 255, 255, 0.14)'
            }}
          >
            <div
              className="px-5 py-3.5 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#94A3B8]" />
                <span className="text-sm font-semibold text-[#F8FAFC]">
                  Snapshot · {activeSnapshotModal.id}
                </span>
                <span className="text-xs font-mono text-[#71717A]">
                  ({activeSnapshotModal.timestamp})
                </span>
              </div>
              <button
                onClick={() => setActiveSnapshotModal(null)}
                className="p-1 rounded text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1D222A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div
                className="relative w-full aspect-[16/9] rounded overflow-hidden"
                style={{
                  backgroundColor: '#0B0D11',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <svg
                  viewBox="0 0 800 450"
                  className="w-full h-full object-cover"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <rect width="800" height="450" fill="#18202C" />
                  <polygon
                    points="0,230 95,195 190,210 310,168 430,198 540,162 670,185 800,170 800,320 0,320"
                    fill="#232B28"
                  />
                  <polygon
                    points="0,265 120,245 240,268 380,222 490,238 615,215 730,245 800,235 800,370 0,370"
                    fill="#2A3025"
                  />
                  <polygon
                    points="0,315 210,295 460,312 690,288 800,300 800,450 0,450"
                    fill="#1E2219"
                  />
                  {(activeSnapshotModal.snapshotMeta?.scenario === 'warning' ||
                    activeSnapshotModal.snapshotMeta?.scenario === 'critical') && (
                      <g opacity="0.75">
                        <ellipse cx="420" cy="195" rx="38" ry="22" fill="#64748B" />
                        <ellipse cx="442" cy="160" rx="54" ry="28" fill="#94A3B8" opacity="0.6" />
                      </g>
                    )}
                  {activeSnapshotModal.snapshotMeta?.scenario === 'critical' && (
                    <g>
                      <polygon
                        points="396,254 406,216 418,242 426,210 438,245 448,254"
                        fill="#EF4444"
                      />
                      <polygon
                        points="406,254 416,228 426,246 432,224 440,254"
                        fill="#F59E0B"
                      />
                    </g>
                  )}
                </svg>

                {activeSnapshotModal.snapshotMeta?.boxes?.map((box, idx) => (
                  <div
                    key={idx}
                    className="absolute"
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.w}%`,
                      height: `${box.h}%`,
                      border: `1.5px solid ${box.color}`
                    }}
                  >
                    <div
                      className="absolute -top-6 left-[-1.5px] px-1.5 py-0.5 text-[11px] font-mono tabular-nums font-medium"
                      style={{
                        backgroundColor: box.color,
                        color: box.type === 'fire' ? '#F8FAFC' : '#0F1115'
                      }}
                    >
                      {box.type} · {Math.round(box.confidence * 100)}%
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded bg-[#0F1115] border border-white/[0.08]">
                  <div className="text-[#71717A]">Source</div>
                  <div className="font-mono text-[#F8FAFC] mt-0.5">
                    {activeSnapshotModal.source}
                  </div>
                </div>
                <div className="p-3 rounded bg-[#0F1115] border border-white/[0.08]">
                  <div className="text-[#71717A]">Readings</div>
                  <div className="font-mono tabular-nums font-semibold text-[#F8FAFC] mt-0.5">
                    {activeSnapshotModal.snapshotMeta?.temp} ·{' '}
                    {activeSnapshotModal.snapshotMeta?.smoke}
                  </div>
                </div>
                <div className="p-3 rounded bg-[#0F1115] border border-white/[0.08]">
                  <div className="text-[#71717A]">Detection</div>
                  <div className="font-mono tabular-nums font-semibold text-[#F8FAFC] mt-0.5">
                    {activeSnapshotModal.reading}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="px-5 py-3 flex justify-end"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              <button
                onClick={() => setActiveSnapshotModal(null)}
                className="px-3.5 py-1.5 rounded text-xs font-medium text-[#F8FAFC] hover:bg-[#1D222A] bg-[#0F1115] border border-white/[0.1]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
