import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

const ModeToggle = () => {
  const { setTheme, theme } = useTheme();

  const isDarkMode = theme === "dark";

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ModeToggle;
