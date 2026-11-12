import type { ReactNode } from 'react';
import { MessageSquareText, Star, Store, UtensilsCrossed } from 'lucide-react';

const features = [
  {
    icon: Store,
    title: 'Temukan warung',
    description: 'Lihat menu, lokasi, dan suasana tiap warung dalam satu tempat.',
  },
  {
    icon: Star,
    title: 'Pilih dari review',
    description: 'Bandingkan penilaian nyata sebelum memutuskan makan di mana.',
  },
  {
    icon: MessageSquareText,
    title: 'Kelola kontribusimu',
    description: 'Ubah review sendiri dan ikut menjaga kualitas informasi kantin.',
  },
];

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border-2 border-border bg-surface shadow-dialog lg:grid lg:grid-cols-[1.1fr_0.9fr]">
      <aside className="relative isolate hidden overflow-hidden border-l-2 border-border bg-primary p-10 text-white lg:order-2 lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-accent/30 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-black/10 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="flex size-11 -rotate-6 items-center justify-center rounded-xl border-2 border-border bg-accent text-text">
              <UtensilsCrossed className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-heading text-lg font-extrabold leading-none">
                NyamNyam
              </span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/80">
                Review Kantin
              </span>
            </span>
          </div>

          <div className="mt-14">
            <p className="inline-block -rotate-2 rounded-md border-2 border-border bg-accent px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-text">
              Kantin kampus, tanpa ribet
            </p>
            <h2 className="mt-4 max-w-sm font-heading text-4xl font-extrabold leading-tight">
              Makan enak, pilih lebih yakin.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/90">
              NyamNyam menghubungkan pelanggan, pemilik warung, dan admin dalam satu
              ruang yang sederhana.
            </p>
          </div>

          <ul className="mt-10 space-y-5">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl border-2 border-border bg-surface text-text">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span>
                  <strong className="block text-sm font-extrabold">{title}</strong>
                  <span className="mt-0.5 block text-xs leading-relaxed text-white/85">
                    {description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 mt-12 max-w-sm text-xs leading-relaxed text-white/75">
          Satu akun untuk menjelajah, menulis review, dan mengelola warung sesuai
          kebutuhanmu.
        </p>
      </aside>

      <section className="p-6 sm:p-10 lg:order-1 lg:p-14">{children}</section>
    </div>
  );
}