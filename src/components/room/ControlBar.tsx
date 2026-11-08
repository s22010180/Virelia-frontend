import type { ReactNode } from 'react';
import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';
import { cn } from '@/lib/cn';

function RoundButton({
  active,
  danger,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'grid size-12 place-items-center rounded-full transition-all duration-150 active:scale-90',
        danger
          ? 'bg-rose-600 text-white shadow-md hover:bg-rose-700'
          : active
            ? 'bg-white text-slate-800 shadow ring-1 ring-slate-200 hover:bg-slate-50'
            : 'bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100',
      )}
    >
      {children}
    </button>
  );
}

export function ControlBar({
  micOn,
  camOn,
  onToggleMic,
  onToggleCam,
  onLeave,
  leaveLabel,
  children,
}: {
  micOn: boolean;
  camOn: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onLeave: () => void;
  leaveLabel: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-3 rounded-full border border-slate-200 bg-white/90 px-4 py-2.5 shadow-lift backdrop-blur-xl">
      <RoundButton active={micOn} onClick={onToggleMic} label={micOn ? 'Mute microphone' : 'Unmute microphone'}>
        {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
      </RoundButton>
      <RoundButton active={camOn} onClick={onToggleCam} label={camOn ? 'Turn camera off' : 'Turn camera on'}>
        {camOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
      </RoundButton>
      {children}
      <span className="mx-1 h-8 w-px bg-slate-200" />
      <button
        type="button"
        onClick={onLeave}
        className="flex h-12 items-center gap-2 rounded-full bg-rose-600 px-5 text-sm font-semibold text-white shadow-md transition hover:bg-rose-700 active:scale-95"
      >
        <PhoneOff className="size-[18px]" />
        {leaveLabel}
      </button>
    </div>
  );
}
