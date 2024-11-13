import { FaHardHat } from 'react-icons/fa';
import { GiCrane } from 'react-icons/gi';
import Link from 'next/link';

export default function RecipePage() {
  return (
    <div className="px-6 py-6 sm:px-24 sm:py-12">
      <h1 className="font-bold text-4xl text-amber-800">Recipe Details</h1>
      <p className="text-gray-500">MVG.life</p>

      <div className="text-center space-y-6">
        <div className="text-6xl">
          <GiCrane className="inline-block text-yellow-500" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3 justify-center">
          Under Construction
          <FaHardHat className="text-yellow-500" />
        </h1>
        
        <p className="text-xl text-gray-600">
          We're building something awesome! Check back soon.
        </p>
        
        <div className="flex gap-2 justify-center text-gray-400 text-sm">
          {[...Array(3)].map((_, i) => (
            <span key={i}>🚧</span>
          ))}
        </div>
        <Link href="/" className="font-mono text-amber-800">
          [go Home]
        </Link>
      </div>
    </div>
  );
}
