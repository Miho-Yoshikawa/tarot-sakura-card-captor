import { motion } from "motion/react";
import { useEffect, useState } from "react";

export type EffectType = "fire" | "water" | "nature" | "wind" | "light" | "dark" | "magic";

export function getCardEffect(cardId: string): EffectType {
  const fire = ["firey", "arrow", "shot", "sword", "thunder"];
  const water = ["watery", "rain", "bubbles", "snow", "freeze", "wave"];
  const nature = ["earthy", "wood", "flower", "sweet", "sand"];
  const wind = ["windy", "fly", "dash", "jump", "storm", "float", "cloud", "mist"];
  const light = ["light", "glow", "create", "illusion", "mirror"];
  const dark = ["dark", "shadow", "silent", "sleep", "erase", "nothing"];
  
  if (fire.includes(cardId)) return "fire";
  if (water.includes(cardId)) return "water";
  if (nature.includes(cardId)) return "nature";
  if (wind.includes(cardId)) return "wind";
  if (light.includes(cardId)) return "light";
  if (dark.includes(cardId)) return "dark";
  return "magic";
}

export function CardEffects({ type }: { type: EffectType }) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const count = type === "wind" ? 15 : 40;
    const newParticles = Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 180 + 40;
      return {
        id: i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: type === "wind" ? Math.random() * 30 + 15 : Math.random() * 14 + 6,
        duration: Math.random() * 1.5 + 1,
        delay: Math.random() * 0.3,
      };
    });
    setParticles(newParticles);
  }, [type]);

  const getColor = () => {
    switch (type) {
      case "fire": return ["#ff4500", "#ff8c00", "#ffd700"];
      case "water": return ["#00bfff", "#1e90ff", "#87cefa", "#e0ffff"];
      case "nature": return ["#32cd32", "#228b22", "#98fb98", "#ffb7c5"];
      case "wind": return ["#e0ffff", "#f0ffff", "#ffffff", "#b0e0e6"];
      case "light": return ["#ffd700", "#ffffe0", "#ffffff", "#fffacd"];
      case "dark": return ["#4b0082", "#800080", "#191970", "#000000"];
      default: return ["#ffb6c1", "#ff69b4", "#e05a7e", "#e6c27a"];
    }
  };

  const colors = getColor();

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      {particles.map((p) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        if (type === "wind") {
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -150, y: p.y - 50 }}
              animate={{
                opacity: [0, 0.8, 0],
                x: [ -150, p.x, p.x + 150 ],
                y: [ p.y - 50, p.y, p.y + 50 ]
              }}
              transition={{ duration: p.duration, delay: p.delay, ease: "easeInOut" }}
              style={{
                position: "absolute",
                width: p.size * 4,
                height: 2,
                backgroundColor: color,
                borderRadius: "50%",
                filter: "blur(1px)",
                transform: "rotate(-15deg)"
              }}
            />
          );
        }

        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1.5, 0],
              x: p.x,
              y: p.y,
              rotate: Math.random() * 360 + 180
            }}
            transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              backgroundColor: color,
              borderRadius: type === "nature" || type === "water" || type === "light" ? "0" : "50%",
              clipPath: 
                type === "nature" ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" : // Leaf
                type === "water" ? "polygon(50% 0%, 100% 100%, 0% 100%)" : // Drop
                type === "light" ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" : "none", // Star
              boxShadow: type === "light" || type === "magic" || type === "fire" ? `0 0 12px ${color}` : "none",
            }}
          />
        );
      })}
    </div>
  );
}
