export default function Loading() {
  return (
    <div className="fixed inset-0 bg-cgc-ink z-[9999] flex flex-col items-center justify-center">
      {/* Top loading bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/5">
        <div
          className="h-full bg-cgc-red"
          style={{
            animation: 'loadbar 1.5s ease-in-out infinite',
            transformOrigin: 'left center',
          }}
        />
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center gap-4">
        <img
          src="/images/logo.jpg"
          alt="CGC"
          className="w-16 h-16 object-contain"
          style={{ animation: 'pulse 1.8s ease-in-out infinite' }}
        />
        <p
          className="font-inter text-[10px] tracking-[0.6em] text-gray-600"
          style={{ animation: 'pulse 1.8s ease-in-out infinite 0.2s' }}
        >
          Loading
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loadbar {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}} />
    </div>
  )
}
