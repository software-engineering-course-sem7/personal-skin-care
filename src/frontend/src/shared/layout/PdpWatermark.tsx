/**
 * Единый декоративный фон «ПДП» для всех страниц (за контентом).
 */
export function PdpWatermark() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      <span
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-black leading-[0.82] tracking-[-0.04em] text-[#F3F5F0]"
        style={{
          fontSize: 'min(1000px, 92vw)',
          fontWeight: 900,
          opacity: 0.82,
        }}
      >
        ПДП
      </span>
    </div>
  )
}
