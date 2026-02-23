import ConnectionChip from '../connection/ConnectionChip'
import { useUiStore } from '../../stores/uiStore'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex flex-col shrink-0 border-b border-white/5 bg-[#0a0a0a]">
      <div className="h-0.5 w-full bg-gradient-to-r from-pv-red via-flash-red to-pv-red shrink-0" aria-hidden />
      <div className="h-14 flex items-center justify-between px-6">
        <div className="flex items-center gap-1">
          <span className="text-xl font-light text-cta-ice tracking-tight">Anvi</span>
          <span className="text-xl font-light text-white/40 tracking-tight">Agent Builder</span>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionChip />
          <button
            type="button"
            onClick={() => useUiStore.getState().setSettingsOpen(true)}
            className="p-2 rounded-lg text-white/30 hover:text-white/60 transition-all duration-150"
            aria-label="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
