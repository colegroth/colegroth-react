import Prism from '../blocks/Prism';
import MagicBento from '../blocks/MagicBento';
import { reviews } from '../src/reviews';

export default function Home() {
  // Filter for only "Feature" type reviews for the homepage
  const features = reviews.filter(r => r.type === 'feature');

  return (
    <div className="relative min-h-screen">
      {/* 1. The Background Layer */}
      <Prism />

      {/* 2. The Content Layer */}
      <div className="relative z-10">
        <MagicBento items={features} />
      </div>
    </div>
  );
}