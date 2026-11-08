import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { MicOff, VideoOff } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/cn';

export function VideoTile({
  stream,
  label,
  muted = false,
  mirrored = false,
  camOff = false,
  micOff = false,
  placeholder,
  className,
  children,
}: {
  stream: MediaStream | null;
  label: string;
  muted?: boolean;
  mirrored?: boolean;
  camOff?: boolean;
  micOff?: boolean;
  placeholder?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.srcObject = stream;
    if (stream) el.play().catch(() => undefined);
  }, [stream]);

  const showPlaceholder = !stream || camOff;

  return (
    <div className={cn('relative overflow-hidden rounded-3xl bg-slate-900 shadow-lift ring-1 ring-black/5', className)}>
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={muted}
        className={cn('size-full object-cover transition-opacity duration-300', mirrored && '-scale-x-100', showPlaceholder ? 'opacity-0' : 'opacity-100')}
      />
      {showPlaceholder && (
        <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-slate-800 to-slate-900">
          {placeholder ?? (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <Avatar name={label} size="lg" />
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <VideoOff className="size-4" /> Camera off
              </span>
            </div>
          )}
        </div>
      )}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
        {micOff && <MicOff className="size-3.5 text-rose-300" />}
        {label}
      </div>
      {children}
    </div>
  );
}
