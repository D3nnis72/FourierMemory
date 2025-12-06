import { LandingHero } from "../components/features/landing/LandingHero";
import { LandingDatasetPreview } from "../components/features/landing/LandingDatasetPreview";
import { getDatasets } from "../lib/api/datasets";
import { Card } from "../components/ui/Card";

export default async function HomePage() {
  const datasets = await getDatasets().catch(() => []);
  return (
    <div className="space-y-8">
      <LandingHero />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dataset gallery preview</h2>
        </div>
        <LandingDatasetPreview datasets={datasets} />
      </div>
      <Card className="p-6 text-white/80">
        <h3 className="text-xl font-semibold mb-2">How it works</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Upload images to generate Fourier spectra.</li>
          <li>Play a two player memory game pairing images and spectra.</li>
          <li>Open Learn mode to explore pairs side by side.</li>
        </ol>
      </Card>
    </div>
  );
}

