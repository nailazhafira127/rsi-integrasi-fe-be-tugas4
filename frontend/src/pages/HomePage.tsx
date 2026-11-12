import { useCallback, useEffect, useState } from 'react';
import {
  ArrowDown,
  MessageSquare,
  RefreshCw,
  Search,
  Star,
  Store,
  UtensilsCrossed,
} from 'lucide-react';
import { StallCard } from '../components/StallCard.tsx';
import {
  Alert,
  Button,
  EmptyState,
  LoadingPanel,
  PageHeader,
  Spinner,
  inputClass,
} from '../components/ui.tsx';
import { stallsApi } from '../lib/api.ts';
import { buttonClass } from '../lib/buttonClass.ts';
import { getApiErrorMessage } from '../lib/http.ts';
import type { Stall } from '../types/api.ts';

export function HomePage() {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await stallsApi.list({
        search: search.trim() || undefined,
        category: category.trim() || undefined,
      });
      setStalls(result);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [load]);

  const average =
    stalls.length === 0
      ? 0
      : stalls.reduce((total, stall) => total + stall.avgRating, 0) / stalls.length;
  const totalReviews = stalls.reduce((total, stall) => total + stall.reviewCount, 0);
  const hasLoadError = !isLoading && error !== null && stalls.length === 0;
  const hasFilter = search.trim() !== '' || category.trim() !== '';

  function resetFilters(): void {
    setSearch('');
    setCategory('');
  }

  return (
    <div>
      <section className="mb-12">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="relative overflow-hidden rounded-[2rem] border-2 border-border bg-accent p-7 shadow-dialog sm:p-10">
            <UtensilsCrossed
              className="pointer-events-none absolute -bottom-8 -right-6 size-48 rotate-12 text-text/10"
              aria-hidden="true"
            />
            <span className="relative inline-block -rotate-2 rounded-md border-2 border-border bg-surface px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em]">
              Kantin kampus, tanpa ribet
            </span>
            <h1 className="relative mt-5 max-w-2xl font-heading text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
              Mau{' '}
              <span className="inline-block -rotate-2 rounded-2xl border-2 border-border bg-primary px-3 text-white shadow-[4px_4px_0_0_#141414]">
                makan
              </span>{' '}
              apa hari ini?
            </h1>
            <p className="relative mt-5 max-w-xl text-base font-medium leading-relaxed sm:text-lg">
              Cek menu dan rating, baca review jujur dari anak kampus, lalu gas ke
              warung favoritmu.
            </p>
            <div className="relative mt-7 flex flex-wrap items-center gap-3">
              <a href="#daftar-warung" className={buttonClass('primary')}>
                Gas jelajahi warung
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
              <span className="inline-flex h-11 items-center gap-2 rounded-full border-2 border-border bg-surface px-4 text-xs font-extrabold">
                <MessageSquare className="size-4 text-primary" aria-hidden="true" />
                {totalReviews} review terkumpul
              </span>
            </div>
          </div>

          <div className="relative flex flex-col justify-between rounded-[2rem] border-2 border-border bg-primary p-7 text-white shadow-dialog lg:rotate-2">
            <div className="flex items-center justify-between gap-4">
              <span className="flex size-12 items-center justify-center rounded-2xl border-2 border-border bg-accent text-text">
                <UtensilsCrossed className="size-6" aria-hidden="true" />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-border bg-surface px-3 py-1 text-xs font-extrabold text-text">
                <Star className="size-4 fill-warning text-warning" aria-hidden="true" />
                {average.toFixed(1)} / 5
              </span>
            </div>
            <div>
              <p className="mb-1 mt-10 font-heading text-2xl font-extrabold">
                Ringkasan kantin
              </p>
              <p className="mb-5 text-sm leading-relaxed text-white/85">
                Angka ini ngikutin hasil pencarian yang lagi kamu lihat.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border-2 border-border bg-surface p-4 text-text">
                  <p className="mb-0 font-heading text-4xl font-extrabold">{stalls.length}</p>
                  <p className="mb-0 text-xs font-bold">Warung</p>
                </div>
                <div className="rounded-2xl border-2 border-border bg-mint p-4 text-text">
                  <p className="mb-0 font-heading text-4xl font-extrabold">{totalReviews}</p>
                  <p className="mb-0 text-xs font-bold">Review</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 -rotate-1 overflow-hidden rounded-xl border-2 border-border bg-text py-2.5 text-accent">
          <div className="animate-marquee flex w-max gap-8 whitespace-nowrap font-heading text-sm font-extrabold uppercase tracking-widest">
            {Array.from({ length: 12 }).map((_, index) => (
              <span key={index}>✦ Makan enak ✦ Review jujur ✦ Anti zonk</span>
            ))}
          </div>
        </div>
      </section>

      <div id="daftar-warung" className="scroll-mt-28">
        <PageHeader
          eyebrow="Direktori"
          title="Daftar Warung"
          description="Cari berdasarkan nama warung atau kategori, lalu buka detail untuk melihat menu dan review."
          actions={
            <Button variant="secondary" onClick={() => void load()} disabled={isLoading}>
              {isLoading ? <Spinner /> : <RefreshCw className="size-4" aria-hidden="true" />}
              Muat Ulang
            </Button>
          }
        />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <label className="relative block flex-1">
            <span className="sr-only">Cari warung</span>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              className={`${inputClass} rounded-full pl-12`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama warung..."
            />
          </label>
          <label className="block sm:w-56">
            <span className="sr-only">Filter kategori</span>
            <input
              className={`${inputClass} rounded-full`}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Filter kategori..."
            />
          </label>
          {hasFilter ? (
            <Button variant="ghost" onClick={resetFilters} className="sm:shrink-0">
              Reset
            </Button>
          ) : null}
        </div>

        {error && !hasLoadError ? (
          <div className="mb-4">
            <Alert tone="error">{error}</Alert>
          </div>
        ) : null}

        <div aria-busy={isLoading}>
          {isLoading && stalls.length === 0 ? (
            <LoadingPanel message="Memuat daftar warung..." />
          ) : hasLoadError ? (
            <EmptyState
              icon={Store}
              title="Daftar warung belum bisa dimuat"
              message={error ?? 'Periksa koneksimu lalu coba lagi.'}
              action={
                <Button variant="secondary" onClick={() => void load()}>
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Coba Lagi
                </Button>
              }
            />
          ) : stalls.length === 0 ? (
            <EmptyState
              icon={Store}
              title="Warung tidak ditemukan"
              message={
                hasFilter
                  ? 'Coba ubah kata kunci atau kosongkan filter.'
                  : 'Belum ada warung yang terdaftar.'
              }
              action={
                hasFilter ? (
                  <Button variant="secondary" onClick={resetFilters}>
                    Reset Filter
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {stalls.map((stall) => (
                <StallCard key={stall.id} stall={stall} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}