import Link from "next/link";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

export function LandingHero() {
  return (
    <Card className="p-8 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1 space-y-4">
        <p className="text-sm uppercase tracking-widest text-accent-blue">Fourier Memory Arena</p>
        <h1 className="text-4xl font-bold leading-tight">
          Play, learn, and upload datasets to explore images and their spectra.
        </h1>
        <p className="text-white/70">
          A two player memory match with educational overlays, plus a learning arena and an upload
          studio.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link href="/datasets">
            <Button>Play Two Player Game</Button>
          </Link>
          <Link href="/datasets">
            <Button variant="ghost">Learn Fourier</Button>
          </Link>
          <Link href="/upload">
            <Button variant="ghost">Upload Dataset</Button>
          </Link>
        </div>
      </div>
      <div className="flex-1">
        <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-accent-pink">
          <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4">
            <div className="bg-white/15 rounded-xl border border-white/10"></div>
            <div className="bg-white/10 rounded-xl border border-white/10"></div>
            <div className="bg-white/10 rounded-xl border border-white/10"></div>
            <div className="bg-white/15 rounded-xl border border-white/10"></div>
          </div>
          <div className="absolute bottom-4 left-4 text-sm text-white/80">Original vs Fourier</div>
        </div>
      </div>
    </Card>
  );
}

