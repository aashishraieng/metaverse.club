
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

export function ThemeCustomizer() {
  const themes = [
    { name: "Default", primary: "222.2 47.4% 11.2%" },
    { name: "Royal", primary: "235 46% 20%" },
    { name: "Forest", primary: "142 76% 36%" },
    { name: "Sunset", primary: "12 76% 61%" },
  ];

  const handleThemeChange = (primaryColor) => {
    document.documentElement.style.setProperty("--primary", primaryColor);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="relative group">
        <Button
          size="icon"
          variant="outline"
          className="rounded-full shadow-lg"
        >
          <Palette className="h-5 w-5" />
        </Button>
        
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col gap-2 min-w-[120px]">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme.primary)}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-sm"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: `hsl(${theme.primary})` }}
                />
                {theme.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
