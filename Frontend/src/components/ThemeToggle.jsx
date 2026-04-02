import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Dark mode" : "Light mode"}
      className="fixed bottom-5 right-5 z-[120] w-11 h-11 rounded-full border border-slate-500/50 bg-slate-900/80 text-slate-100 backdrop-blur-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center"
    >
      <span className="text-lg leading-none" aria-hidden="true">
        {isLight ? "☾" : "☀"}
      </span>
    </button>
  );
}
