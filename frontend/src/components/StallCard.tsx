import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import type { Stall } from '../types/api.ts';
import { formatRating } from '../lib/format.ts';
import { Badge, Card } from './ui.tsx';

export function StallCard({ stall }: { stall: Stall }) {
  return (
    <Card className="flex h-full flex-col p-5 transition duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-dialog">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {stall.category ? <Badge tone="primary">{stall.category}</Badge> : null}
            {stall.isPopular ? <Badge tone="warning">🔥 Populer</Badge> : null}
          </div>
          <h2 className="mb-1 font-heading text-xl font-extrabold leading-tight">
            {stall.name}
          </h2>
          <p className="mb-0 text-xs font-medium text-text-muted">oleh {stall.ownerName}</p>
        </div>
        <div className="flex shrink-0 -rotate-3 flex-col items-center rounded-xl border-2 border-border bg-accent px-3 py-2 shadow-[2px_2px_0_0_#141414]">
          <span className="inline-flex items-center gap-1 text-base font-extrabold text-text">
            <Star className="size-4 fill-text text-text" aria-hidden="true" />
            {formatRating(stall.avgRating)}
          </span>
          <span className="text-[10px] font-bold text-text">{stall.reviewCount} review</span>
        </div>
      </div>

      {stall.description ? (
        <p className="mb-4 mt-3 line-clamp-2 text-sm leading-relaxed text-text-muted">
          {stall.description}
        </p>
      ) : (
        <p className="mb-4 mt-3 text-sm italic text-text-muted">Belum ada deskripsi.</p>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 border-t-2 border-dashed border-border pt-3">
        <span className="inline-flex min-w-0 items-center gap-1 text-xs font-semibold text-text-muted">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{stall.location || 'Lokasi belum diisi'}</span>
        </span>
        <Link
          to={`/stalls/${stall.id}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-border bg-primary px-3.5 py-1.5 text-xs font-extrabold text-white shadow-[2px_2px_0_0_#141414] transition hover:bg-primary-hover"
        >
          Cek warung
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}