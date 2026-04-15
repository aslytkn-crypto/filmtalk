import { Language, Theme } from "../i18n";
import { Sun, Moon, Globe } from "lucide-react";

interface NavbarProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: any;
}

export default function Navbar({ language, setLanguage, theme, toggleTheme, t }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-black border-b border-border">
      <div className="max-w-[1024px] mx-auto px-[50px] h-[90px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-red rounded-[4px] relative">
            <div className="absolute top-1 left-2 w-4 h-3 bg-white [clip-path:polygon(0_0,100%_50%,0_100%)]" />
          </div>
          <span className="text-2xl font-extrabold tracking-tighter uppercase">FILMTALK</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <NavLink label={t.home} active />
          <NavLink label={t.about} />
          <NavLink label={t.contact} />
          
          <div className="flex items-center gap-4 border-l border-border pl-8">
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-brand-dark rounded transition-colors text-text-dim hover:text-text-main"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button 
              onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
              className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-text-dim hover:text-text-main"
            >
              <Globe size={16} />
              {language === "tr" ? "EN" : "TR"}
            </button>

            <button className="btn-bold">
              {t.subscribe}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <a
      href="#"
      className={`text-[13px] font-bold uppercase tracking-widest transition-colors ${
        active ? "text-text-main" : "text-text-dim hover:text-text-main"
      }`}
    >
      <span>{label}</span>
    </a>
  );
}
