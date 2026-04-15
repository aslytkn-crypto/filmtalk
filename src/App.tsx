import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import StreakCounter from "./components/StreakCounter";
import MovieCard from "./components/MovieCard";
import HolyTrinity from "./components/HolyTrinity";
import ChatRoom from "./components/ChatRoom";
import { getMovieRecommendations } from "./services/geminiService";
import { Movie } from "./types";
import { Language, Theme, translations } from "./i18n";

export default function App() {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<Language>("tr");
  const [theme, setTheme] = useState<Theme>("dark");
  const [view, setView] = useState<"home" | "profile">("home");

  const t = translations[language];

  useEffect(() => {
    async function loadRecs() {
      try {
        const recs = await getMovieRecommendations("Cinematic masterpieces, sci-fi, dark thrillers, modern classics");
        setRecommendations(recs);
      } catch (error) {
        console.error("Failed to load recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadRecs();
  }, []);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  return (
    <div className="min-h-screen bg-brand-black flex flex-col">
      <Navbar 
        language={language} 
        setLanguage={setLanguage} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        t={t}
      />
      
      <main className="max-w-[1024px] mx-auto px-[50px] pt-[130px] flex-grow grid grid-cols-[280px_1fr_280px] gap-10 pb-20">
        {/* Left Sidebar */}
        <aside className="space-y-8">
          <div className="cursor-pointer" onClick={() => setView("home")}>
            <StreakCounter count={14} label={t.streakLabel} />
          </div>
          
          <div className="card-bold">
            <h2 className="mb-4">{t.lastWatched}</h2>
            <div className="space-y-3">
              <h4 className="text-base font-bold">Interstellar</h4>
              <div className="text-brand-red text-xs font-bold">★★★★★ 9.0</div>
              <p className="text-xs text-text-dim leading-relaxed">
                "Zamanın ötesinde bir başyapıt. AI özetleme aktif."
              </p>
            </div>
          </div>

          <button 
            onClick={() => setView(view === "home" ? "profile" : "home")}
            className="w-full card-bold hover:bg-brand-red hover:text-white transition-all text-left group"
          >
            <h2 className={`mb-1 group-hover:text-white`}>{t.profile}</h2>
            <p className="text-[10px] text-text-dim group-hover:text-white/80 uppercase tracking-widest font-bold">
              {view === "home" ? "View Profile" : "Back to Home"}
            </p>
          </button>
        </aside>

        {/* Center Content */}
        <section className="flex flex-col items-center text-center">
          {view === "home" ? (
            <>
              <h1 className="mb-10 text-text-main">
                {t.heroTitle}<br />
                <span className="text-brand-red">{t.heroSubtitle}</span>
              </h1>
              
              <div className="w-full space-y-10">
                <div className="text-left">
                  <h2 className="mb-6">{t.specialForYou}</h2>
                  <div className="grid grid-cols-2 gap-5">
                    {isLoading ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-[2/3] bg-brand-dark border border-border animate-pulse" />
                      ))
                    ) : (
                      recommendations.slice(0, 4).map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full space-y-12">
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="w-24 h-24 rounded-full bg-brand-red/20 border-2 border-brand-red flex items-center justify-center text-4xl">👤</div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Cinephile_User</h3>
                  <p className="text-xs text-brand-red font-bold uppercase tracking-[0.3em]">Elite Member</p>
                </div>
              </div>
              <HolyTrinity t={t} />
            </div>
          )}
        </section>

        {/* Right Sidebar */}
        <aside className="space-y-8">
          <div>
            <h2 className="mb-4">{t.specialForYou}</h2>
            <div className="space-y-4">
              {isLoading ? (
                [...Array(2)].map((_, i) => (
                  <div key={i} className="h-20 bg-brand-dark border border-border animate-pulse" />
                ))
              ) : (
                recommendations.slice(4, 6).map(movie => (
                  <div key={movie.id} className="flex gap-3">
                    <div className="w-[60px] h-[80px] bg-brand-dark border border-border overflow-hidden flex-shrink-0">
                      <img src={movie.imageUrl} alt={movie.title} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold leading-tight mb-1">{movie.title}</h4>
                      <p className="text-[11px] text-text-dim uppercase tracking-wider">{movie.genre} • {movie.year}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col h-[400px]">
            <h2 className="mb-4">{t.chatRooms}</h2>
            <ChatRoom roomName="Sci-Fi Masterpieces" t={t} />
          </div>
        </aside>
      </main>

      <footer className="max-w-[1024px] mx-auto w-full px-[50px] py-5 border-t border-border flex justify-between text-[10px] font-bold text-text-dim uppercase tracking-widest">
        <div>{t.poweredBy}</div>
        <div>{t.copyright}</div>
      </footer>
    </div>
  );
}
