import { Movie } from "../types";
import MovieCard from "./MovieCard";

const MOCK_TRINITY: Movie[] = [
  {
    id: "1",
    title: "Interstellar",
    year: "2014",
    genre: "Sci-Fi",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    rating: 8.7,
    imageUrl: "https://picsum.photos/seed/space/400/600",
  },
  {
    id: "2",
    title: "The Godfather",
    year: "1972",
    genre: "Crime",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    rating: 9.2,
    imageUrl: "https://picsum.photos/seed/mafia/400/600",
  },
  {
    id: "3",
    title: "Parasite",
    year: "2019",
    genre: "Thriller",
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    rating: 8.5,
    imageUrl: "https://picsum.photos/seed/house/400/600",
  },
];

export default function HolyTrinity({ t }: { t: any }) {
  return (
    <section className="w-full">
      <div className="text-center mb-10">
        <div className="text-[11px] font-extrabold uppercase tracking-[3px] text-brand-red mb-2">{t.holyTrinity}</div>
        <p className="text-[10px] text-text-dim uppercase tracking-widest">{t.holyTrinityDesc}</p>
      </div>

      <div className="flex gap-5 w-full">
        {MOCK_TRINITY.map((movie, idx) => (
          <div key={movie.id} className="flex-1 relative group">
            <div className="absolute bottom-5 left-5 z-10 text-sm font-bold uppercase tracking-tight text-white drop-shadow-lg">
              0{idx + 1}. {movie.title}
            </div>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
