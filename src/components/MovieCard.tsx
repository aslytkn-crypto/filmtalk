import { Star, PlayCircle } from "lucide-react";
import { Movie } from "../types";
import { motion } from "motion/react";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative aspect-[2/3] overflow-hidden border border-border bg-brand-dark cursor-pointer"
    >
      <img
        src={movie.imageUrl}
        alt={movie.title}
        className="w-full h-full object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-80"
        referrerPolicy="no-referrer"
      />
      
      <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-brand-black to-transparent">
        <div className="text-brand-red text-[11px] font-black uppercase tracking-[3px] mb-1">
          {movie.genre}
        </div>
        <h3 className="text-sm font-bold uppercase tracking-tight leading-tight mb-1">{movie.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{movie.year}</span>
          <span className="text-[10px] font-bold text-brand-red">★ {movie.rating}</span>
        </div>
      </div>
    </motion.div>
  );
}
